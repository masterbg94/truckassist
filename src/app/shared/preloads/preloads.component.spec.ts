import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreloadsComponent } from './preloads.component';

describe('PreloadsComponent', () => {
  let component: PreloadsComponent;
  let fixture: ComponentFixture<PreloadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreloadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
