import { Component, output, signal, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrl: './toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent {
  readonly toggled = output<boolean>();
  readonly checked = signal(false);

  toggle(): void {
    this.checked.update((v) => !v);
    this.toggled.emit(this.checked());
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggle();
    }
  }
}
