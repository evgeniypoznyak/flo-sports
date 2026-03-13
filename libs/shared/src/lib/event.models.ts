export type EventStatus = 'upcoming' | 'live' | 'completed';

export type StreamHealth = 'excellent' | 'good' | 'fair' | 'poor';

export interface FloEvent {
  readonly id: string;
  readonly title: string;
  readonly sport: string;
  readonly league: string;
  readonly status: EventStatus;
  readonly startTime: string;
}

export interface LiveStats {
  readonly eventId: string;
  readonly viewerCount: number;
  readonly peakViewerCount: number;
  readonly streamHealth: StreamHealth;
  readonly lastUpdated: string;
}

export interface EventWithStats extends FloEvent {
  readonly liveStats?: LiveStats;
}

export interface EventFilterParams {
  readonly sport?: string;
  readonly status?: EventStatus;
  readonly search?: string;
}
