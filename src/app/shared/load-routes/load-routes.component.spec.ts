import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadRoutesComponent } from './load-routes.component';

describe('LoadRoutesComponent', () => {
  let component: LoadRoutesComponent;
  let fixture: ComponentFixture<LoadRoutesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadRoutesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
