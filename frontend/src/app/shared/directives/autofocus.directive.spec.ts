import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutofocusDirective } from './autofocus.directive';

@Component({
  imports: [AutofocusDirective],
  template: `<input appAutofocus />`,
})
class TestHostComponent {}

describe('AutofocusDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();
  });

  it('enfoca el elemento al inicializar la vista', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    const input = fixture.nativeElement.querySelector(
      'input',
    ) as HTMLInputElement;
    const focusSpy = vi.spyOn(input, 'focus');

    fixture.detectChanges();

    expect(focusSpy).toHaveBeenCalledWith({ preventScroll: true });
  });
});
