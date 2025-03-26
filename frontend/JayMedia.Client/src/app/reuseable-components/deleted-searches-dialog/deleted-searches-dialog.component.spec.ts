import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedSearchesDialogComponent } from './deleted-searches-dialog.component';

describe('DeletedSearchesDialogComponent', () => {
  let component: DeletedSearchesDialogComponent;
  let fixture: ComponentFixture<DeletedSearchesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletedSearchesDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletedSearchesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
