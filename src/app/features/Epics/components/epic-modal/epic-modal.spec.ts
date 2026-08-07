import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpicModal } from './epic-modal';

describe('EpicModal', () => {
  let component: EpicModal;
  let fixture: ComponentFixture<EpicModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpicModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EpicModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
