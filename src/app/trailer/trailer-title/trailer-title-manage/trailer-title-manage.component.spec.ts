import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerTitleManageComponent } from './trailer-title-manage.component';

describe('TrailerTitleManageComponent', () => {
  let component: TrailerTitleManageComponent;
  let fixture: ComponentFixture<TrailerTitleManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailerTitleManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerTitleManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
