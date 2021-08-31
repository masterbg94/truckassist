import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailerImportComponent } from './trailer-import.component';

describe('TrailerImportComponent', () => {
  let component: TrailerImportComponent;
  let fixture: ComponentFixture<TrailerImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailerImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailerImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
