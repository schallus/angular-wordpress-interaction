import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageListArticlesComponent } from './page-list-articles.component';

describe('PageListArticlesComponent', () => {
  let component: PageListArticlesComponent;
  let fixture: ComponentFixture<PageListArticlesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageListArticlesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageListArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
