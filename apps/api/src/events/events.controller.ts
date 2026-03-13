import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventWithStats } from '@flo-sports/shared';
import { EventsService } from './events.service';
import { EventFilterDto } from './dto/event-filter.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(@Query() filters: EventFilterDto): EventWithStats[] {
    return this.eventsService.findAll(filters);
  }

  @Get('sports')
  getSports(): string[] {
    return this.eventsService.getSports();
  }

  @Get(':id')
  findOne(@Param('id') id: string): EventWithStats {
    return this.eventsService.findOne(id);
  }
}
