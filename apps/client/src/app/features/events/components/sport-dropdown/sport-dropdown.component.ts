import {
  Component,
  input,
  output,
  signal,
  computed,
  ElementRef,
  inject,
  HostListener,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'app-sport-dropdown',
  templateUrl: './sport-dropdown.component.html',
  styleUrl: './sport-dropdown.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportDropdownComponent {
  readonly options = input<string[]>([]);
  readonly sportSelected = output<string>();

  readonly isOpen = signal(false);
  readonly searchTerm = signal('');
  readonly selectedLabel = signal('All Sports');

  private readonly elementRef = inject(ElementRef);

  readonly filteredOptions = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.options();
    return this.options().filter((o) => o.toLowerCase().includes(term));
  });

  toggleDropdown(): void {
    this.isOpen.update((v) => !v);
    if (!this.isOpen()) this.searchTerm.set('');
  }

  selectOption(option: string): void {
    this.selectedLabel.set(option);
    this.isOpen.set(false);
    this.searchTerm.set('');
    this.sportSelected.emit(option);
  }

  clearSelection(): void {
    this.selectedLabel.set('All Sports');
    this.isOpen.set(false);
    this.searchTerm.set('');
    this.sportSelected.emit('');
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isOpen.set(false);
      this.searchTerm.set('');
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
      this.searchTerm.set('');
    }
  }
}
