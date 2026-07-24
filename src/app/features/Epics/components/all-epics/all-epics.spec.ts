import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEpics } from './all-epics';

describe('AllEpics', () => {
  let component: AllEpics;
  let fixture: ComponentFixture<AllEpics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllEpics],
    }).compileComponents();

    fixture = TestBed.createComponent(AllEpics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
