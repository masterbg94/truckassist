import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageLoadComponent } from './manage-load.component';

describe('ManageLoadComponent', () => {
  let component: ManageLoadComponent;
  let fixture: ComponentFixture<ManageLoadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ManageLoadComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
