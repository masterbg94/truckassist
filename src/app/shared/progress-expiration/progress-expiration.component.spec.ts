import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressExpirationComponent } from './progress-expiration.component';

describe('ProgressExpirationComponent', () => {
  let component: ProgressExpirationComponent;
  let fixture: ComponentFixture<ProgressExpirationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressExpirationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressExpirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
