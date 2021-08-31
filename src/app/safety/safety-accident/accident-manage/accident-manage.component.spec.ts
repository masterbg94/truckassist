import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccidentManageComponent } from './accident-manage.component';

describe('AccidentManageComponent', () => {
  let component: AccidentManageComponent;
  let fixture: ComponentFixture<AccidentManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccidentManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
