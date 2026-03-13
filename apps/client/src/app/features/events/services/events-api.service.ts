import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { EventFilterParams, EventWithStats } from '@flo-sports/shared';

@Injectable({ providedIn: 'root' })
export class EventsApiService {
  private readonly http = inject(HttpClient);

  getEvents(filters: EventFilterParams): Observable<EventWithStats[]> {
    const params = this.buildParams(filters);
    return this.http.get<EventWithStats[]>('/api/events', { params });
  }

  getSports(): Observable<string[]> {
    return this.http.get<string[]>('/api/events/sports');
  }

  private buildParams(filters: EventFilterParams): HttpParams {
    let params = new HttpParams();
    if (filters.status) params = params.set('status', filters.status);
    if (filters.sport) params = params.set('sport', filters.sport);
    if (filters.search) params = params.set('search', filters.search);
    return params;
  }
}
