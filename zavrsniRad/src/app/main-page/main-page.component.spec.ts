import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PocetnaComponent } from './main-page.component';

describe('PocetnaComponent', () => {
  let component: PocetnaComponent;
  let fixture: ComponentFixture<PocetnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PocetnaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PocetnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
