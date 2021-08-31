import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSearchContainerComponent } from './chat-search-container.component';

describe('ChatSearchContainerComponent', () => {
  let component: ChatSearchContainerComponent;
  let fixture: ComponentFixture<ChatSearchContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatSearchContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatSearchContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
