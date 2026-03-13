import { EventStatus } from '@flo-sports/shared';

export class EventFilterDto {
  sport?: string;
  status?: EventStatus;
  search?: string;
}
