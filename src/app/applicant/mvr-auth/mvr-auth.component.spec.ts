import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MvrAuthComponent } from './mvr-auth.component';

describe('MvrAuthComponent', () => {
  let component: MvrAuthComponent;
  let fixture: ComponentFixture<MvrAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MvrAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MvrAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
