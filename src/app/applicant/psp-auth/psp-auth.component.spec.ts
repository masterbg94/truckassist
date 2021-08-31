import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PspAuthComponent } from './psp-auth.component';

describe('PspAuthComponent', () => {
  let component: PspAuthComponent;
  let fixture: ComponentFixture<PspAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PspAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PspAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
