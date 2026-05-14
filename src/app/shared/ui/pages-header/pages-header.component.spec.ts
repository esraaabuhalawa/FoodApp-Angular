import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagesHeaderComponent } from './pages-header.component';

describe('PagesHeaderComponent', () => {
  let component: PagesHeaderComponent;
  let fixture: ComponentFixture<PagesHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PagesHeaderComponent]
    });
    fixture = TestBed.createComponent(PagesHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
