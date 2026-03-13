import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComponentRef } from '@angular/core';
import { FilterBarComponent } from './filter-bar.component';
import type { EventFilterParams } from '@flo-sports/shared';

describe('FilterBarComponent', () => {
  let component: FilterBarComponent;
  let componentRef: ComponentRef<FilterBarComponent>;
  let fixture: ComponentFixture<FilterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterBarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterBarComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('sports', ['Baseball', 'Wrestling']);
    fixture.detectChanges();
  });

  it('should render all three filter controls', () => {
    const toggle = fixture.nativeElement.querySelector('app-toggle');
    const search = fixture.nativeElement.querySelector('app-search-input');
    const dropdown = fixture.nativeElement.querySelector('app-sport-dropdown');

    expect(toggle).toBeTruthy();
    expect(search).toBeTruthy();
    expect(dropdown).toBeTruthy();
  });

  it('should emit filter with status live when toggle is activated', () => {
    const emitSpy = vi.fn();
    component.filtersChanged.subscribe(emitSpy);

    component.onLiveOnlyToggle(true);

    expect(emitSpy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'live' }),
    );
  });

  it('should emit filter with undefined status when toggle is deactivated', () => {
    const emitSpy = vi.fn();
    component.filtersChanged.subscribe(emitSpy);

    component.onLiveOnlyToggle(true);
    component.onLiveOnlyToggle(false);

    const lastCall = emitSpy.mock.calls[emitSpy.mock.calls.length - 1][0] as EventFilterParams;
    expect(lastCall.status).toBeUndefined();
  });

  it('should emit filter with search param', () => {
    const emitSpy = vi.fn();
    component.filtersChanged.subscribe(emitSpy);

    component.onSearchChanged('NCAA');

    expect(emitSpy).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'NCAA' }),
    );
  });

  it('should emit filter with sport param', () => {
    const emitSpy = vi.fn();
    component.filtersChanged.subscribe(emitSpy);

    component.onSportSelected('Wrestling');

    expect(emitSpy).toHaveBeenCalledWith(
      expect.objectContaining({ sport: 'Wrestling' }),
    );
  });
});
