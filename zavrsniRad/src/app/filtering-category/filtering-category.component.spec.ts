import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltriranjeKategorijaComponent } from './filtering-category.component';

describe('FiltriranjeKategorijaComponent', () => {
  let component: FiltriranjeKategorijaComponent;
  let fixture: ComponentFixture<FiltriranjeKategorijaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FiltriranjeKategorijaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FiltriranjeKategorijaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
