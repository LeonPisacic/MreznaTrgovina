import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KosaricaComponent } from './shopping-cart.component';

describe('KosaricaComponent', () => {
  let component: KosaricaComponent;
  let fixture: ComponentFixture<KosaricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KosaricaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(KosaricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
