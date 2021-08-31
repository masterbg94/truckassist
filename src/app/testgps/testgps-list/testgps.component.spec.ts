import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestgpsComponent } from './testgps.component';

describe('TestgpsComponent', () => {
  let component: TestgpsComponent;
  let fixture: ComponentFixture<TestgpsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestgpsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestgpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
