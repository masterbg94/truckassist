import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomTabSelectComponent } from './custom-tab-select.component';

describe('CustomTabSelectComponent', () => {
  let component: CustomTabSelectComponent;
  let fixture: ComponentFixture<CustomTabSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomTabSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomTabSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
