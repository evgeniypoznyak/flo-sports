import { join } from 'path';
import { JsonEventsRepository } from './json-events.repository';
import { FloEvent, LiveStats } from '@flo-sports/shared';

const DATA_PATH = join(__dirname, '..', 'assets', 'data');

describe('JsonEventsRepository', () => {
  let repository: JsonEventsRepository;

  beforeEach(() => {
    repository = new JsonEventsRepository(DATA_PATH);
  });

  describe('findAllEvents', () => {
    it('should return typed FloEvent array', () => {
      const events = repository.findAllEvents();

      expect(Array.isArray(events)).toBe(true);
      expect(events.length).toBeGreaterThan(0);
    });

    it('should only return events with valid ids', () => {
      const events = repository.findAllEvents();

      events.forEach((event: FloEvent) => {
        expect(event.id).toBeDefined();
        expect(event.title).toBeDefined();
        expect(event.sport).toBeDefined();
        expect(event.status).toBeDefined();
      });
    });

    it('should filter out empty objects from source data', () => {
      const events = repository.findAllEvents();

      const emptyEvents = events.filter((e) => !e.id);
      expect(emptyEvents.length).toBe(0);
    });
  });

  describe('findAllLiveStats', () => {
    it('should return typed LiveStats array', () => {
      const stats = repository.findAllLiveStats();

      expect(Array.isArray(stats)).toBe(true);
      expect(stats.length).toBeGreaterThan(0);
    });

    it('should return records with required fields', () => {
      const stats = repository.findAllLiveStats();

      stats.forEach((stat: LiveStats) => {
        expect(stat.eventId).toBeDefined();
        expect(stat.viewerCount).toBeDefined();
        expect(stat.peakViewerCount).toBeDefined();
        expect(stat.streamHealth).toBeDefined();
      });
    });
  });
});
