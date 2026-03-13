import { NotFoundException } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventWithStats } from '@flo-sports/shared';

const MERGED_EVENTS: EventWithStats[] = [
  { id: 'evt-1', title: 'NCAA Wrestling', sport: 'Wrestling', league: 'NCAA', status: 'live', startTime: '2026-02-15T10:00:00Z', liveStats: { eventId: 'evt-1', viewerCount: 5000, peakViewerCount: 8000, streamHealth: 'excellent', lastUpdated: '2026-02-15T10:30:00Z' } },
  { id: 'evt-2', title: 'MLB Spring', sport: 'Baseball', league: 'MLB', status: 'upcoming', startTime: '2026-03-01T18:00:00Z' },
];

function createMockService(): EventsService {
  return {
    findAll: vi.fn().mockReturnValue(MERGED_EVENTS),
    findOne: vi.fn().mockReturnValue(MERGED_EVENTS[0]),
    getSports: vi.fn().mockReturnValue(['Baseball', 'Wrestling']),
  } as unknown as EventsService;
}

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  beforeEach(() => {
    service = createMockService();
    controller = new EventsController(service);
  });

  describe('GET /api/events', () => {
    it('should call service.findAll with query params', () => {
      const filters = { sport: 'Wrestling', status: 'live' as const, search: 'NCAA' };

      controller.findAll(filters);

      expect(service.findAll).toHaveBeenCalledWith(filters);
    });

    it('should return the service result', () => {
      const result = controller.findAll({});

      expect(result).toEqual(MERGED_EVENTS);
    });
  });

  describe('GET /api/events/:id', () => {
    it('should call service.findOne with the id', () => {
      controller.findOne('evt-1');

      expect(service.findOne).toHaveBeenCalledWith('evt-1');
    });

    it('should propagate NotFoundException from service', () => {
      vi.mocked(service.findOne).mockImplementation(() => {
        throw new NotFoundException('Not found');
      });

      expect(() => controller.findOne('bad-id')).toThrow(NotFoundException);
    });
  });

  describe('GET /api/sports', () => {
    it('should return the sports list from service', () => {
      const result = controller.getSports();

      expect(result).toEqual(['Baseball', 'Wrestling']);
      expect(service.getSports).toHaveBeenCalled();
    });
  });
});
