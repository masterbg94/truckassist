import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvrDetailsComponent } from './mvr-details.component';

describe('MvrDetailsComponent', () => {
  let component: MvrDetailsComponent;
  let fixture: ComponentFixture<MvrDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvrDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvrDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
