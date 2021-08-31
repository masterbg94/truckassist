import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDropdownDialogComponent } from './delete-dropdown-dialog.component';

describe('DeleteDropdownDialogComponent', () => {
  let component: DeleteDropdownDialogComponent;
  let fixture: ComponentFixture<DeleteDropdownDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteDropdownDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDropdownDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
