import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KontaktInfoComponent } from './contact-info.component';

describe('KontaktInfoComponent', () => {
  let component: KontaktInfoComponent;
  let fixture: ComponentFixture<KontaktInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KontaktInfoComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(KontaktInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
