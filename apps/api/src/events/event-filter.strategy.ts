import { FloEvent, EventFilterParams, EventStatus } from '@flo-sports/shared';

export function filterByStatus(events: FloEvent[], status?: EventStatus): FloEvent[] {
  if (!status) return events;
  return events.filter((event) => event.status === status);
}

export function filterBySport(events: FloEvent[], sport?: string): FloEvent[] {
  if (!sport) return events;
  return events.filter((event) => event.sport === sport);
}

export function filterBySearch(events: FloEvent[], search?: string): FloEvent[] {
  if (!search) return events;
  const term = search.toLowerCase();
  return events.filter((event) => event.title.toLowerCase().includes(term));
}

export function applyFilters(events: FloEvent[], filters: EventFilterParams): FloEvent[] {
  const afterStatus = filterByStatus(events, filters.status);
  const afterSport = filterBySport(afterStatus, filters.sport);
  return filterBySearch(afterSport, filters.search);
}
