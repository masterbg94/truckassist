import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationManageComponent } from './violation-manage.component';

describe('ViolationManageComponent', () => {
  let component: ViolationManageComponent;
  let fixture: ComponentFixture<ViolationManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViolationManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViolationManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
