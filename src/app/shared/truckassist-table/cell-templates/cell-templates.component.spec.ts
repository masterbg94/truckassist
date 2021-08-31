import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CellTemplatesComponent } from './cell-templates.component';

describe('CellTemplatesComponent', () => {
  let component: CellTemplatesComponent;
  let fixture: ComponentFixture<CellTemplatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CellTemplatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CellTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
