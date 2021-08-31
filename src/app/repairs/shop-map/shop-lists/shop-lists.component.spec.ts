import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopListsComponent } from './shop-lists.component';

describe('ShopListsComponent', () => {
  let component: ShopListsComponent;
  let fixture: ComponentFixture<ShopListsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopListsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
