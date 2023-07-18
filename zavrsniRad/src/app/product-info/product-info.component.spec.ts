import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpisProizvodaComponent } from './product-info.component';

describe('OpisProizvodaComponent', () => {
  let component: OpisProizvodaComponent;
  let fixture: ComponentFixture<OpisProizvodaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpisProizvodaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OpisProizvodaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
