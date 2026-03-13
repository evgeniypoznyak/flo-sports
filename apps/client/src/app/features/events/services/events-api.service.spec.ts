import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EventsApiService } from './events-api.service';
import { EventFilterParams } from '@flo-sports/shared';

describe('EventsApiService', () => {
  let service: EventsApiService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        EventsApiService,
      ],
    });
    service = TestBed.inject(EventsApiService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  describe('getEvents', () => {
    it('should call GET /api/events with no params when filters are empty', () => {
      service.getEvents({}).subscribe();

      const req = httpTesting.expectOne('/api/events');
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should send filter params as query string', () => {
      const filters: EventFilterParams = { status: 'live', sport: 'Wrestling', search: 'NCAA' };

      service.getEvents(filters).subscribe();

      const req = httpTesting.expectOne(
        (r) => r.url === '/api/events'
          && r.params.get('status') === 'live'
          && r.params.get('sport') === 'Wrestling'
          && r.params.get('search') === 'NCAA',
      );
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should omit undefined filter params', () => {
      const filters: EventFilterParams = { status: 'live' };

      service.getEvents(filters).subscribe();

      const req = httpTesting.expectOne((r) => r.url === '/api/events');
      expect(req.request.params.has('sport')).toBe(false);
      expect(req.request.params.has('search')).toBe(false);
      expect(req.request.params.get('status')).toBe('live');
      req.flush([]);
    });
  });

  describe('getSports', () => {
    it('should call GET /api/events/sports', () => {
      service.getSports().subscribe();

      const req = httpTesting.expectOne('/api/events/sports');
      expect(req.request.method).toBe('GET');
      req.flush(['Baseball', 'Wrestling']);
    });
  });
});
