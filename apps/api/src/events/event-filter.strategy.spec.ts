import { FloEvent, EventFilterParams } from '@flo-sports/shared';
import {
  filterByStatus,
  filterBySport,
  filterBySearch,
  applyFilters,
} from './event-filter.strategy';

const EVENTS: FloEvent[] = [
  { id: '1', title: 'NCAA Wrestling Finals', sport: 'Wrestling', league: 'NCAA', status: 'live', startTime: '2026-02-15T10:00:00Z' },
  { id: '2', title: 'MLB Spring Training', sport: 'Baseball', league: 'MLB', status: 'upcoming', startTime: '2026-03-01T18:00:00Z' },
  { id: '3', title: 'SEC Wrestling Open', sport: 'Wrestling', league: 'SEC', status: 'completed', startTime: '2026-01-10T14:00:00Z' },
  { id: '4', title: 'NCA Cheer Nationals', sport: 'Cheerleading', league: 'NCA', status: 'live', startTime: '2026-02-15T09:00:00Z' },
];

describe('filterByStatus', () => {
  it('should return only events matching the given status', () => {
    const result = filterByStatus(EVENTS, 'live');

    expect(result).toHaveLength(2);
    expect(result.every((e) => e.status === 'live')).toBe(true);
  });

  it('should return all events when status is undefined', () => {
    const result = filterByStatus(EVENTS, undefined);

    expect(result).toHaveLength(EVENTS.length);
  });
});

describe('filterBySport', () => {
  it('should return only events matching the given sport', () => {
    const result = filterBySport(EVENTS, 'Wrestling');

    expect(result).toHaveLength(2);
    expect(result.every((e) => e.sport === 'Wrestling')).toBe(true);
  });

  it('should return all events when sport is undefined', () => {
    const result = filterBySport(EVENTS, undefined);

    expect(result).toHaveLength(EVENTS.length);
  });
});

describe('filterBySearch', () => {
  it('should return events whose title contains the search term', () => {
    const result = filterBySearch(EVENTS, 'NCAA');

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should match case-insensitively', () => {
    const result = filterBySearch(EVENTS, 'ncaa');

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should return all events when search is undefined', () => {
    const result = filterBySearch(EVENTS, undefined);

    expect(result).toHaveLength(EVENTS.length);
  });

  it('should return all events when search is empty string', () => {
    const result = filterBySearch(EVENTS, '');

    expect(result).toHaveLength(EVENTS.length);
  });
});

describe('applyFilters', () => {
  it('should compose all filters together', () => {
    const filters: EventFilterParams = { status: 'live', sport: 'Wrestling' };
    const result = applyFilters(EVENTS, filters);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('should return all events when no filters provided', () => {
    const result = applyFilters(EVENTS, {});

    expect(result).toHaveLength(EVENTS.length);
  });

  it('should compose status and search', () => {
    const filters: EventFilterParams = { status: 'live', search: 'Cheer' };
    const result = applyFilters(EVENTS, filters);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('4');
  });
});
