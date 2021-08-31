import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TrailerInspectionManageComponent } from './trailer-inspection-manage.component';

describe('TrailerInspectionManageComponent', () => {
  let component: TrailerInspectionManageComponent;
  let fixture: ComponentFixture<TrailerInspectionManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailerInspectionManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerInspectionManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
