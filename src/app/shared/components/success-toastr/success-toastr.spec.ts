import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessToastr } from './success-toastr';

describe('SuccessToastr', () => {
  let component: SuccessToastr;
  let fixture: ComponentFixture<SuccessToastr>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccessToastr],
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessToastr);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
