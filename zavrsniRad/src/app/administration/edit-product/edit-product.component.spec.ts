import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProizvodaComponent } from './edit-product.component';

describe('EditProizvodaComponent', () => {
  let component: EditProizvodaComponent;
  let fixture: ComponentFixture<EditProizvodaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditProizvodaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditProizvodaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
