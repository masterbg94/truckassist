import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactManageComponent } from './contact-manage.component';

describe('ContactManageComponent', () => {
  let component: ContactManageComponent;
  let fixture: ComponentFixture<ContactManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactManageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
