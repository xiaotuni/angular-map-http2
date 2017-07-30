import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Product } from './product.component';

describe('Product', () => {
  let component: Product;
  let fixture: ComponentFixture<Product>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Product ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Product);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
