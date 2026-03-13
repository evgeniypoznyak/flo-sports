import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import type { EventFilterParams } from '@flo-sports/shared';
import { ToggleComponent } from '../toggle/toggle.component';
import { SearchInputComponent } from '../search-input/search-input.component';
import { SportDropdownComponent } from '../sport-dropdown/sport-dropdown.component';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss',
  imports: [ToggleComponent, SearchInputComponent, SportDropdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterBarComponent {
  readonly sports = input<string[]>([]);
  readonly filtersChanged = output<EventFilterParams>();

  private currentFilters: EventFilterParams = {};

  onLiveOnlyToggle(isLive: boolean): void {
    this.currentFilters = {
      ...this.currentFilters,
      status: isLive ? 'live' : undefined,
    };
    this.filtersChanged.emit(this.currentFilters);
  }

  onSearchChanged(search: string): void {
    this.currentFilters = {
      ...this.currentFilters,
      search: search || undefined,
    };
    this.filtersChanged.emit(this.currentFilters);
  }

  onSportSelected(sport: string): void {
    this.currentFilters = {
      ...this.currentFilters,
      sport: sport || undefined,
    };
    this.filtersChanged.emit(this.currentFilters);
  }
}
