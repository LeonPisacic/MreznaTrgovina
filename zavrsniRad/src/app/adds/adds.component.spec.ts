import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReklameComponent } from './adds.component';

describe('ReklameComponent', () => {
  let component: ReklameComponent;
  let fixture: ComponentFixture<ReklameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReklameComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ReklameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
