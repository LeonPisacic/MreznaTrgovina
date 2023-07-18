import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContactUserComponent } from './admin-contact-user.component';

describe('AdminContactUserComponent', () => {
  let component: AdminContactUserComponent;
  let fixture: ComponentFixture<AdminContactUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminContactUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminContactUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
