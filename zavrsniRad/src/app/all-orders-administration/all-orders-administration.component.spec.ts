import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllOrdersAdministrationComponent } from './all-orders-administration.component';

describe('AllOrdersAdministrationComponent', () => {
  let component: AllOrdersAdministrationComponent;
  let fixture: ComponentFixture<AllOrdersAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllOrdersAdministrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllOrdersAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
