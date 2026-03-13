import { Component, output, signal, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnInit, OnDestroy {
  readonly searchChanged = output<string>();
  readonly value = signal('');

  private readonly input$ = new Subject<string>();
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscription = this.input$
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term) => this.searchChanged.emit(term));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.value.set(term);
    this.input$.next(term);
  }

  clear(): void {
    this.value.set('');
    this.input$.next('');
  }
}
