import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import type { EventFilterParams, EventWithStats } from '@flo-sports/shared';
import { EventsApiService } from './services/events-api.service';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { EventListComponent } from './components/event-list/event-list.component';

@Component({
  selector: 'app-events-page',
  templateUrl: './events.page.html',
  styleUrl: './events.page.scss',
  imports: [FilterBarComponent, EventListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsPage implements OnInit {
  private readonly eventsApi = inject(EventsApiService);

  readonly events = signal<EventWithStats[]>([]);
  readonly sports = signal<string[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  ngOnInit(): void {
    this.loadSports();
    this.loadEvents({});
  }

  onFiltersChanged(filters: EventFilterParams): void {
    this.loadEvents(filters);
  }

  private loadEvents(filters: EventFilterParams): void {
    this.loading.set(true);
    this.error.set('');
    this.eventsApi.getEvents(filters).subscribe({
      next: (events) => {
        this.events.set(events);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load events. Please try again.');
        this.loading.set(false);
      },
    });
  }

  private loadSports(): void {
    this.eventsApi.getSports().subscribe({
      next: (sports) => this.sports.set(sports),
      error: () => this.error.set('Failed to load sports list.'),
    });
  }
}
