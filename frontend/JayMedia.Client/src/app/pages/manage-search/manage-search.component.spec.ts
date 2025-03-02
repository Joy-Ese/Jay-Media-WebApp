import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSearchComponent } from './manage-search.component';

describe('ManageSearchComponent', () => {
  let component: ManageSearchComponent;
  let fixture: ComponentFixture<ManageSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
