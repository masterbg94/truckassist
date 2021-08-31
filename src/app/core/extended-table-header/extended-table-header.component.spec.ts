import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtendedTableHeaderComponent } from './extended-table-header.component';

describe('ExtendedTableHeaderComponent', () => {
  let component: ExtendedTableHeaderComponent;
  let fixture: ComponentFixture<ExtendedTableHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExtendedTableHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtendedTableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
