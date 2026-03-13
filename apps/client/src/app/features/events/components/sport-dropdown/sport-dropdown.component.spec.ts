import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SportDropdownComponent } from './sport-dropdown.component';
import { ComponentRef } from '@angular/core';

describe('SportDropdownComponent', () => {
  let component: SportDropdownComponent;
  let componentRef: ComponentRef<SportDropdownComponent>;
  let fixture: ComponentFixture<SportDropdownComponent>;

  const SPORTS = ['Baseball', 'Cheerleading', 'Wrestling'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SportDropdownComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SportDropdownComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('options', SPORTS);
    fixture.detectChanges();
  });

  it('should render closed by default with placeholder', () => {
    const trigger = fixture.nativeElement.querySelector('.dropdown__trigger');
    expect(trigger.textContent).toContain('All Sports');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('should open dropdown panel on click', () => {
    const trigger = fixture.nativeElement.querySelector('.dropdown__trigger');
    trigger.click();
    fixture.detectChanges();

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    const panel = fixture.nativeElement.querySelector('.dropdown__panel');
    expect(panel).toBeTruthy();
  });

  it('should show all options when open', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.dropdown__option:not(.dropdown__option--clear)');
    expect(options.length).toBe(SPORTS.length);
  });

  it('should emit selected sport and close on option click', () => {
    const emitSpy = vi.fn();
    component.sportSelected.subscribe(emitSpy);

    component.isOpen.set(true);
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.dropdown__option:not(.dropdown__option--clear)');
    options[2].click();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith('Wrestling');
    expect(component.isOpen()).toBe(false);
    expect(component.selectedLabel()).toBe('Wrestling');
  });

  it('should filter options when typing in search', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const searchInput = fixture.nativeElement.querySelector('.dropdown__search') as HTMLInputElement;
    searchInput.value = 'Base';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const options = fixture.nativeElement.querySelectorAll('.dropdown__option:not(.dropdown__option--clear)');
    expect(options.length).toBe(1);
    expect(options[0].textContent.trim()).toBe('Baseball');
  });

  it('should close on Escape key', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    const dropdown = fixture.nativeElement.querySelector('.dropdown');
    dropdown.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();

    expect(component.isOpen()).toBe(false);
  });

  it('should close on click outside', () => {
    component.isOpen.set(true);
    fixture.detectChanges();

    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();

    expect(component.isOpen()).toBe(false);
  });

  it('should have proper ARIA attributes', () => {
    const trigger = fixture.nativeElement.querySelector('.dropdown__trigger');
    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');

    component.isOpen.set(true);
    fixture.detectChanges();

    const panel = fixture.nativeElement.querySelector('.dropdown__panel');
    expect(panel.getAttribute('role')).toBe('listbox');
  });

  it('should emit empty string and reset label on clear selection', () => {
    const emitSpy = vi.fn();
    component.sportSelected.subscribe(emitSpy);

    component.selectedLabel.set('Wrestling');
    component.isOpen.set(true);
    fixture.detectChanges();

    const clearOption = fixture.nativeElement.querySelector('.dropdown__option--clear');
    clearOption.click();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith('');
    expect(component.selectedLabel()).toBe('All Sports');
  });
});
