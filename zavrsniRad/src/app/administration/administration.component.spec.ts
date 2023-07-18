import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracijaComponent } from './administration.component';

describe('AdministracijaComponent', () => {
  let component: AdministracijaComponent;
  let fixture: ComponentFixture<AdministracijaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdministracijaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AdministracijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
