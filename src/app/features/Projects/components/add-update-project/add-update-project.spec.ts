import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateProject } from './add-update-project';

describe('AddUpdateProject', () => {
  let component: AddUpdateProject;
  let fixture: ComponentFixture<AddUpdateProject>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddUpdateProject],
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdateProject);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
