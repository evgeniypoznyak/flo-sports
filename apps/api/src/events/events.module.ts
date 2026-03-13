import { Module } from '@nestjs/common';
import { join } from 'path';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsRepository } from './events.repository';
import { JsonEventsRepository, DATA_PATH } from './json-events.repository';

@Module({
  controllers: [EventsController],
  providers: [
    {
      provide: DATA_PATH,
      useValue: join(__dirname, 'assets', 'data'),
    },
    {
      provide: EventsRepository,
      useClass: JsonEventsRepository,
    },
    EventsService,
  ],
})
export class EventsModule {}
