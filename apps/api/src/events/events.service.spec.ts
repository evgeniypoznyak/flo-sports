import { NotFoundException } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsRepository } from './events.repository';
import { FloEvent, LiveStats } from '@flo-sports/shared';

const EVENTS: FloEvent[] = [
  { id: 'evt-1', title: 'NCAA Wrestling Finals', sport: 'Wrestling', league: 'NCAA', status: 'live', startTime: '2026-02-15T10:00:00Z' },
  { id: 'evt-2', title: 'MLB Spring Training', sport: 'Baseball', league: 'MLB', status: 'upcoming', startTime: '2026-03-01T18:00:00Z' },
  { id: 'evt-3', title: 'SEC Wrestling Open', sport: 'Wrestling', league: 'SEC', status: 'completed', startTime: '2026-01-10T14:00:00Z' },
  { id: 'evt-4', title: 'NCA Cheer Nationals', sport: 'Cheerleading', league: 'NCA', status: 'live', startTime: '2026-02-15T09:00:00Z' },
];

const LIVE_STATS: LiveStats[] = [
  { eventId: 'evt-1', viewerCount: 5000, peakViewerCount: 8000, streamHealth: 'excellent', lastUpdated: '2026-02-15T10:30:00Z' },
  { eventId: 'evt-4', viewerCount: 1200, peakViewerCount: 2000, streamHealth: 'good', lastUpdated: '2026-02-15T09:30:00Z' },
];

function createMockRepository(): EventsRepository {
  return {
    findAllEvents: vi.fn().mockReturnValue(EVENTS),
    findAllLiveStats: vi.fn().mockReturnValue(LIVE_STATS),
  } as unknown as EventsRepository;
}

describe('EventsService', () => {
  let service: EventsService;
  let repository: EventsRepository;

  beforeEach(() => {
    repository = createMockRepository();
    service = new EventsService(repository);
  });

  describe('findAll', () => {
    it('should return all events with live stats merged', () => {
      const result = service.findAll({});

      expect(result).toHaveLength(4);
      const liveWrestling = result.find((e) => e.id === 'evt-1');
      expect(liveWrestling?.liveStats).toBeDefined();
      expect(liveWrestling?.liveStats?.viewerCount).toBe(5000);
    });

    it('should not attach stats to non-live events', () => {
      const result = service.findAll({});

      const upcoming = result.find((e) => e.id === 'evt-2');
      expect(upcoming?.liveStats).toBeUndefined();
    });

    it('should filter by status when provided', () => {
      const result = service.findAll({ status: 'live' });

      expect(result).toHaveLength(2);
      expect(result.every((e) => e.status === 'live')).toBe(true);
    });

    it('should filter by sport when provided', () => {
      const result = service.findAll({ sport: 'Wrestling' });

      expect(result).toHaveLength(2);
      expect(result.every((e) => e.sport === 'Wrestling')).toBe(true);
    });

    it('should filter by search term', () => {
      const result = service.findAll({ search: 'NCAA' });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('evt-1');
    });

    it('should compose multiple filters', () => {
      const result = service.findAll({ status: 'live', sport: 'Wrestling' });

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('evt-1');
      expect(result[0].liveStats?.viewerCount).toBe(5000);
    });
  });

  describe('findOne', () => {
    it('should return a single event with stats', () => {
      const result = service.findOne('evt-1');

      expect(result.id).toBe('evt-1');
      expect(result.liveStats?.viewerCount).toBe(5000);
    });

    it('should return event without stats for non-live event', () => {
      const result = service.findOne('evt-2');

      expect(result.id).toBe('evt-2');
      expect(result.liveStats).toBeUndefined();
    });

    it('should throw NotFoundException for unknown id', () => {
      expect(() => service.findOne('nonexistent')).toThrow(NotFoundException);
    });
  });

  describe('getSports', () => {
    it('should return sorted unique sport names', () => {
      const result = service.getSports();

      expect(result).toEqual(['Baseball', 'Cheerleading', 'Wrestling']);
    });
  });
});
