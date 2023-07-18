import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationMessagesComponent } from './administration-messages.component';

describe('AdministrationMessagesComponent', () => {
  let component: AdministrationMessagesComponent;
  let fixture: ComponentFixture<AdministrationMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrationMessagesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrationMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
