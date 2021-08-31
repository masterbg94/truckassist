import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarActionsComponent } from './calendar-actions.component';

describe('CalendarActionsComponent', () => {
  let component: CalendarActionsComponent;
  let fixture: ComponentFixture<CalendarActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalendarActionsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
