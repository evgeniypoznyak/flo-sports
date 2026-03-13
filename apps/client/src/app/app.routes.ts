import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./features/events/events.page').then((m) => m.EventsPage),
  },
];
