import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobNavbar } from './mob-navbar';

describe('MobNavbar', () => {
  let component: MobNavbar;
  let fixture: ComponentFixture<MobNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MobNavbar],
    }).compileComponents();

    fixture = TestBed.createComponent(MobNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
