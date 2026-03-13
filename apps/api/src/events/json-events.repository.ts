import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';
import { readFileSync } from 'fs';
import { FloEvent, LiveStats } from '@flo-sports/shared';
import { EventsRepository } from './events.repository';

export const DATA_PATH = 'DATA_PATH';

@Injectable()
export class JsonEventsRepository extends EventsRepository {
  constructor(@Inject(DATA_PATH) private readonly dataPath: string) {
    super();
  }

  findAllEvents(): FloEvent[] {
    const raw = this.loadJson<FloEvent[]>('flo-events.json');
    return raw.filter((entry) => !!entry.id);
  }

  findAllLiveStats(): LiveStats[] {
    return this.loadJson<LiveStats[]>('live-stats.json');
  }

  private loadJson<T>(filename: string): T {
    const filePath = join(this.dataPath, filename);
    const content = readFileSync(filePath, 'utf-8');
    return JSON.parse(content) as T;
  }
}
