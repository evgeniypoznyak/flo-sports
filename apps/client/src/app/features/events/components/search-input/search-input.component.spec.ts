import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchInputComponent } from './search-input.component';

describe('SearchInputComponent', () => {
  let component: SearchInputComponent;
  let fixture: ComponentFixture<SearchInputComponent>;

  beforeEach(async () => {
    vi.useFakeTimers();

    await TestBed.configureTestingModule({
      imports: [SearchInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render an input element', () => {
    const input = fixture.nativeElement.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('should emit debounced value after typing', async () => {
    const emitSpy = vi.fn();
    component.searchChanged.subscribe(emitSpy);

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'NCAA';
    input.dispatchEvent(new Event('input'));

    expect(emitSpy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(emitSpy).toHaveBeenCalledWith('NCAA');
  });

  it('should show clear button when value is non-empty', () => {
    component.value.set('test');
    fixture.detectChanges();

    const clearBtn = fixture.nativeElement.querySelector('.search-input__clear');
    expect(clearBtn).toBeTruthy();
  });

  it('should hide clear button when value is empty', () => {
    const clearBtn = fixture.nativeElement.querySelector('.search-input__clear');
    expect(clearBtn).toBeNull();
  });

  it('should clear value and emit empty string on clear click', async () => {
    const emitSpy = vi.fn();
    component.searchChanged.subscribe(emitSpy);

    component.value.set('test');
    fixture.detectChanges();

    const clearBtn = fixture.nativeElement.querySelector('.search-input__clear');
    clearBtn.click();
    fixture.detectChanges();

    vi.advanceTimersByTime(300);
    expect(component.value()).toBe('');
    expect(emitSpy).toHaveBeenCalledWith('');
  });
});
