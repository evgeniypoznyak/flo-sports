import { FloEvent, LiveStats } from '@flo-sports/shared';

export abstract class EventsRepository {
  abstract findAllEvents(): FloEvent[];
  abstract findAllLiveStats(): LiveStats[];
}
