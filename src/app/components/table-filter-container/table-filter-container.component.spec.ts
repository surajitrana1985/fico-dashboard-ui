import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFilterContainerComponent } from './table-filter-container.component';

describe('TableFilterContainerComponent', () => {
  let component: TableFilterContainerComponent;
  let fixture: ComponentFixture<TableFilterContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableFilterContainerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFilterContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
