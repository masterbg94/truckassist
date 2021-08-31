import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableViewSwitcherComponent } from './table-view-switcher.component';

describe('TableViewSwitcherComponent', () => {
  let component: TableViewSwitcherComponent;
  let fixture: ComponentFixture<TableViewSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableViewSwitcherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableViewSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
