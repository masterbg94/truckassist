import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerManageComponent } from './trailer-manage.component';

describe('TrailerManageComponent', () => {
  let component: TrailerManageComponent;
  let fixture: ComponentFixture<TrailerManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailerManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
