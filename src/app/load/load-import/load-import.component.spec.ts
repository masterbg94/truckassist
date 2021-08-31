import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadImportComponent } from './load-import.component';

describe('LoadImportComponent', () => {
  let component: LoadImportComponent;
  let fixture: ComponentFixture<LoadImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoadImportComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
