# FloSports Event Explorer

A proof-of-concept event browser for FloSports operations staff. NestJS backend aggregates event data from two sources, Angular frontend provides a filterable UI.

## Demo
[![Watch demo](./artifacts/demo-thumbnail.png)](https://github.com/user-attachments/assets/54b0dd8a-8b13-46c9-ae9c-0c96712ab9fe)

## Setup

```bash
git clone <repo-url>
cd flo-sports
npm install
```

### Run (single command starts both API and frontend)

```bash
npx nx serve client
```

The Angular dev server starts at `http://localhost:4200` and proxies `/api` requests to the NestJS backend on port 3000.

### Run tests

```bash
# All API tests (31 tests)
npx nx test api

# All client tests (29 tests)
npx nx test client --watch=false
```

---

## Assumptions

- **No pagination**: The PRD doesn't mention it. With ~5,000 events this is fine for a POC; for production I'd add cursor-based pagination.
- **Case-insensitive search**: Title search is case-insensitive (e.g., "ncaa" matches "NCAA Wrestling Finals").
- **Debounce timing**: 300ms debounce on the search input to balance responsiveness with request volume.
- **Empty JSON entries**: The provided `flo-events.json` contains 2 empty `{}` objects. The repository filters these out (entries without an `id`).
- **No third-party UI**: All components (toggle, search, dropdown) are built from scratch per the PRD requirement.
- **Filter composition**: Filters are AND-composed — enabling "Live Only" + selecting "Wrestling" shows only live wrestling events.

---

## API Design

Three endpoints under the `/api` global prefix:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events?sport=X&status=Y&search=Z` | List events with optional filters |
| GET | `/api/events/:id` | Get single event by ID |
| GET | `/api/events/sports` | Get sorted list of unique sport names |

**Response shape** for events:

```json
{
  "id": "evt-0003",
  "title": "NCA High School Nationals - Session 2",
  "sport": "Cheerleading",
  "league": "USA Cheer",
  "status": "live",
  "startTime": "2026-02-15T10:58:00.000Z",
  "liveStats": {
    "eventId": "evt-0003",
    "viewerCount": 4171,
    "peakViewerCount": 4955,
    "streamHealth": "good",
    "lastUpdated": "2026-02-17T23:07:47.146Z"
  }
}
```

The `liveStats` field is only present for events with `status: "live"`. Non-live events omit it entirely.

**Query parameters** are all optional. When omitted, no filter is applied for that dimension.

---

## Data Loading & Merging

**Loading**: The `JsonEventsRepository` reads both JSON files from disk using `fs.readFileSync`. Data is loaded on each request (acceptable for a POC; for production, I'd cache in memory with a TTL or load once on module init).

**Merging**: The `EventsService` builds a `Map<string, LiveStats>` keyed by `eventId` for O(1) lookups, then maps over events attaching stats where available. This is a single pass over each dataset — O(n + m) total.

**What changes for real HTTP upstreams**: The `EventsRepository` is an abstract class (port). `JsonEventsRepository` is the current adapter that reads files. To switch to real upstream services, create an `HttpEventsRepository` that calls the upstream APIs and implements the same interface. Swap the provider in `EventsModule` — no service or controller changes needed. This is the Repository pattern (DDD) with Dependency Inversion (SOLID).

---

## Backend Decisions

**Architecture**: Feature-based module structure within `apps/api/src/events/`:

- `events.repository.ts` — Abstract repository interface (port)
- `json-events.repository.ts` — JSON file adapter (infrastructure)
- `event-filter.strategy.ts` — Pure filter functions (Strategy pattern)
- `events.service.ts` — Application service that orchestrates repository + filters
- `events.controller.ts` — Thin HTTP layer, delegates everything to the service
- `dto/event-filter.dto.ts` — Typed query parameters

**Filtering**: Each filter (status, sport, search) is an independent pure function with a guard clause — if the parameter is undefined, it returns the array unchanged. `applyFilters` composes them sequentially. No nested conditionals.

**Shared types**: All domain interfaces live in `libs/shared` and are imported by both frontend and backend via `@flo-sports/shared`.

---

## Trade-offs

**Prioritized**:
- TDD with red-green-refactor for all business logic (60 total tests)
- Clean separation of concerns (repository/service/controller, infrastructure/presentation)
- Accessibility (ARIA attributes, keyboard navigation, focus management)
- All three filter components built from scratch with proper component architecture

**Skipped (would add with more time)**:
- Pagination / virtual scrolling for the event list
- Caching in the repository (load data once instead of per-request)
- E2E tests with Playwright
- More sophisticated dropdown keyboard navigation (arrow keys to move through options)
- Loading skeleton states instead of plain "Loading..." text
- Swagger/OpenAPI documentation

---

## AI Tools

I used Cursor with Claude as an AI assistant throughout development. It was used for:
- Scaffolding the Nx monorepo structure
- Writing test cases and implementations following TDD
- Generating SCSS styles for the filter components
- Debugging TypeScript strict mode issues (e.g., `export type` for re-exports with `isolatedModules`)

Everything in the repo was reviewed and understood by me. I can explain any decision in detail.

---

## Development Process

This section documents the full development workflow from top to bottom: prompts given, plans generated, and how the implementation was executed step by step.

---

### 1. Initial Plan Setup

**Prompt:** Read the assessment folder (especially the PRD PDF) and split the task into 2–3 point stories.

**Result:** A plan with three stories:
- Story 1: Shared models + NestJS backend API
- Story 2: Angular filter bar + event list
- Story 3: Polish, error handling, README

---

### 2. Applying Engineering Principles

**Prompt:** Apply TDD, .cursor/rules, Martin Fowler (guards/early returns), DRY, YAGNI, SOLID, Clean Code, Gang of Four patterns, and DDD (Eric Evans).

**Clarification:** Add a lightweight Repository pattern (DDD-aligned) to answer the PRD question about switching to real HTTP upstreams.

**Plan updates:**
- Guiding Principles section (TDD, Clean Code, SOLID, DRY, YAGNI, DDD, GoF)
- Design Patterns & DDD mapping (Bounded Context, Entity, Value Objects, Repository, Strategy, Adapter, Observer, Facade)
- Exact TDD sequences per component
- Repository interface + `JsonEventsRepository` adapter

---

### 3. Implementation — Story 1: Backend

**3.1 Shared domain model** (`libs/shared/src/lib/event.models.ts`)

- `EventStatus`, `StreamHealth` (value object types)
- `FloEvent` (entity)
- `LiveStats`, `EventWithStats` (aggregate root), `EventFilterParams`
- `libs/shared/src/index.ts` updated with `export type` (required for Angular `isolatedModules`)

**3.2 API test infrastructure**

- `apps/api/vitest.config.ts` — Vitest config with `@flo-sports/shared` alias
- `apps/api/tsconfig.spec.json` — spec tsconfig with vitest globals
- `apps/api/project.json` — added `test` target (`vitest run`)
- `apps/api/tsconfig.json` — added `tsconfig.spec.json` reference

**3.3 Data files**

- Copied `flo-events.json` and `live-stats.json` from `assesment/` to `apps/api/src/assets/data/`
- Converted `flo-events.json` from JavaScript object literal format to valid JSON (original had unquoted keys)
- Filtered 2 empty `{}` entries in the data

**3.4 Repository (TDD)**

- `events.repository.ts` — abstract class with `findAllEvents()`, `findAllLiveStats()`
- `json-events.repository.spec.ts` — 5 tests (typed arrays, valid ids, no empty objects)
- `json-events.repository.ts` — loads JSON from disk, injectable `DATA_PATH` for test vs prod paths

**3.5 Filter strategy (TDD)**

- `event-filter.strategy.spec.ts` — 11 tests (status, sport, search guards, composition)
- `event-filter.strategy.ts` — pure functions: `filterByStatus`, `filterBySport`, `filterBySearch`, `applyFilters` with guard clauses

**3.6 Application service (TDD)**

- `dto/event-filter.dto.ts` — optional `sport`, `status`, `search`
- `events.service.spec.ts` — 10 tests (merge stats, filters, findOne, getSports, NotFoundException)
- `events.service.ts` — orchestrates repository + filter strategies, `buildStatsMap()` for O(1) merge

**3.7 Controller (TDD)**

- `events.controller.spec.ts` — 5 tests (delegation, 404 propagation)
- `events.controller.ts` — thin: `GET /api/events`, `GET /api/events/sports`, `GET /api/events/:id`

**3.8 Module wiring**

- `events.module.ts` — providers for `DATA_PATH`, `EventsRepository` → `JsonEventsRepository`, `EventsService`
- `app.module.ts` — imports `EventsModule`
- Removed `app.controller.ts`, `app.service.ts`
- Removed `libs/shared/src/lib/shared.ts` placeholder

**3.9 Build fixes**

- `tsconfig.app.json` — exclude `**/*.spec.ts` from production build
- `json-events.repository.ts` — fixed type: `FloEvent[]` instead of `Record<string, unknown>[]` for strict mode

**Story 1 outcome:** 31 tests passing across 4 spec files.

---

### 4. Implementation — Story 2: Frontend

**4.1 HTTP client**

- `app.config.ts` — added `provideHttpClient()`

**4.2 Events API service (TDD)**

- `events-api.service.spec.ts` — 4 tests (GET URLs, query params, omit undefined)
- `events-api.service.ts` — `getEvents(filters)`, `getSports()`, typed `HttpClient`

**4.3 Toggle component (TDD)**

- `toggle.component.spec.ts` — 5 tests (aria-checked, click, Enter/Space)
- `toggle.component.ts` — signals, `output()`, OnPush
- `toggle.component.html` — `role="switch"`, `aria-checked`
- `toggle.component.scss` — custom switch styling

**4.4 Search input component (TDD)**

- `search-input.component.spec.ts` — 5 tests (debounce via `vi.useFakeTimers`, clear button)
- `search-input.component.ts` — RxJS `debounceTime(300)`, `Subject` for input stream
- `search-input.component.html` — input + conditional clear button
- `search-input.component.scss` — input styling

**4.5 Sport dropdown component (TDD)**

- `sport-dropdown.component.spec.ts` — 9 tests (open/close, select, filter, Escape, click-outside, ARIA)
- `sport-dropdown.component.ts` — signals, `computed` for filtered options, `HostListener` for click-outside
- `sport-dropdown.component.html` — combobox, listbox, search input, options with `tabindex`, `keydown.enter`
- `sport-dropdown.component.scss` — dropdown panel styling

**4.6 Filter bar component (TDD)**

- `filter-bar.component.spec.ts` — 5 tests (renders controls, emits filters)
- `filter-bar.component.ts` — composes toggle, search, dropdown; emits `EventFilterParams`
- `filter-bar.component.html` — layout of three child components
- `filter-bar.component.scss` — flex layout

**4.7 Event list component**

- `event-list.component.ts` — input `events`, `DatePipe`, `DecimalPipe`
- `event-list.component.html` — cards with status badge, sport, league, startTime, live stats (viewers, peak, streamHealth)
- `event-list.component.scss` — card layout, status colors

**4.8 Events page (container)**

- `events.page.ts` — `EventsApiService`, signals for `events`, `sports`, `loading`, `error`
- `events.page.html` — header, filter bar, error/loading/event list
- `events.page.scss` — page layout

**4.9 Routing and app shell**

- `app.routes.ts` — lazy load `EventsPage` at `/`
- `app.ts` — removed `NxWelcome`, `RouterModule` only
- `app.html` — `<router-outlet>` only
- `app.spec.ts` — simplified to basic create test
- Deleted `nx-welcome.ts`
- `styles.scss` — base reset and body styles

**4.10 Lint and accessibility fixes**

- `sport-dropdown.component.html` — `aria-controls`, `aria-selected`, `tabindex`, `keydown.enter` on options, `tabindex="-1"` on wrapper for focusable element with keydown

**Story 2 outcome:** 29 tests passing across 6 spec files.

---

### 5. Implementation — Story 3: Polish

**5.1 Build verification**

- `nx build api` — success (spec files excluded from build)
- `nx build client` — success

**5.2 README**

- Setup (clone, install, `nx serve client`)
- Run tests
- Assumptions (no pagination, case-insensitive search, debounce, empty JSON handling)
- API design (3 endpoints, response shape)
- Data loading and merging (Map for O(1), repository swap for HTTP)
- Backend decisions (feature-based module, pure filters)
- Trade-offs (prioritized vs skipped)
- AI tools usage

**5.3 Error handling**

- `EventsPage` — `loading` and `error` signals, error display in template
- API error handling in `loadEvents` and `loadSports` subscribe callbacks

**5.4 Final verification**

- `nx test api` — 31 tests pass
- `nx test client --watch=false` — 29 tests pass
- `nx lint client` — 0 errors

---

### 6. Summary

| Metric | Value |
|--------|-------|
| API tests | 31 (4 spec files) |
| Client tests | 29 (6 spec files) |
| Total tests | 60 |
| Lint errors | 0 |
| Build | api + client both succeed |
