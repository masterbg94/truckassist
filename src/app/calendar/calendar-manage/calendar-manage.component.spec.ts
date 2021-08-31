import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarManageComponent } from './calendar-manage.component';

describe('CalendarManageComponent', () => {
  let component: CalendarManageComponent;
  let fixture: ComponentFixture<CalendarManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarManageComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
