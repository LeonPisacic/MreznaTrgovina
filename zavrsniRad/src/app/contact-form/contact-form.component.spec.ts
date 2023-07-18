import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KontaktFormaComponent } from './contact-form.component';

describe('KontaktFormaComponent', () => {
  let component: KontaktFormaComponent;
  let fixture: ComponentFixture<KontaktFormaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KontaktFormaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(KontaktFormaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
