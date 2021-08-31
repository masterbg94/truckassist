import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Tax2290SignerComponent } from './tax2290-signer.component';

describe('Tax2290SignerComponent', () => {
  let component: Tax2290SignerComponent;
  let fixture: ComponentFixture<Tax2290SignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Tax2290SignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tax2290SignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
