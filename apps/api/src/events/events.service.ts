import { Injectable, NotFoundException } from '@nestjs/common';
import { EventFilterParams, EventWithStats, LiveStats } from '@flo-sports/shared';
import { EventsRepository } from './events.repository';
import { applyFilters } from './event-filter.strategy';

@Injectable()
export class EventsService {
  constructor(private readonly repository: EventsRepository) {}

  findAll(filters: EventFilterParams): EventWithStats[] {
    const events = this.repository.findAllEvents();
    const statsMap = this.buildStatsMap();
    const merged = events.map((event) => this.mergeStats(event, statsMap));
    return applyFilters(merged, filters);
  }

  findOne(id: string): EventWithStats {
    const events = this.repository.findAllEvents();
    const event = events.find((e) => e.id === id);
    if (!event) {
      throw new NotFoundException(`Event with id '${id}' not found`);
    }
    const statsMap = this.buildStatsMap();
    return this.mergeStats(event, statsMap);
  }

  getSports(): string[] {
    const events = this.repository.findAllEvents();
    const sports = new Set(events.map((e) => e.sport));
    return [...sports].sort();
  }

  private buildStatsMap(): Map<string, LiveStats> {
    const stats = this.repository.findAllLiveStats();
    return new Map(stats.map((s) => [s.eventId, s]));
  }

  private mergeStats(
    event: EventWithStats,
    statsMap: Map<string, LiveStats>,
  ): EventWithStats {
    const liveStats = statsMap.get(event.id);
    if (!liveStats) return event;
    return { ...event, liveStats };
  }
}
