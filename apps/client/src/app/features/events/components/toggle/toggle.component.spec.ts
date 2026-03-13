import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleComponent } from './toggle.component';

describe('ToggleComponent', () => {
  let component: ToggleComponent;
  let fixture: ComponentFixture<ToggleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render with aria-checked false initially', () => {
    const el = fixture.nativeElement.querySelector('[role="switch"]');
    expect(el.getAttribute('aria-checked')).toBe('false');
  });

  it('should toggle aria-checked to true and emit on click', () => {
    const emitSpy = vi.fn();
    component.toggled.subscribe(emitSpy);

    const el = fixture.nativeElement.querySelector('[role="switch"]');
    el.click();
    fixture.detectChanges();

    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should toggle back to false on second click', () => {
    const el = fixture.nativeElement.querySelector('[role="switch"]');
    el.click();
    fixture.detectChanges();
    el.click();
    fixture.detectChanges();

    expect(el.getAttribute('aria-checked')).toBe('false');
  });

  it('should toggle on Enter key', () => {
    const emitSpy = vi.fn();
    component.toggled.subscribe(emitSpy);

    const el = fixture.nativeElement.querySelector('[role="switch"]');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(el.getAttribute('aria-checked')).toBe('true');
    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should toggle on Space key', () => {
    const el = fixture.nativeElement.querySelector('[role="switch"]');
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
    fixture.detectChanges();

    expect(el.getAttribute('aria-checked')).toBe('true');
  });
});
