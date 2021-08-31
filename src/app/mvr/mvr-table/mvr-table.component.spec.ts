import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvrTableComponent } from './mvr-table.component';

describe('MvrTableComponent', () => {
  let component: MvrTableComponent;
  let fixture: ComponentFixture<MvrTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvrTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvrTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
