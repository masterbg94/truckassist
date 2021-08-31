import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactTableComponent } from './contact-table/contact-table.component';

describe('ContactTableNewComponent', () => {
  let component: ContactTableComponent;
  let fixture: ComponentFixture<ContactTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
