import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartFilterContainerComponent } from './chart-filter-container.component';

describe('ChartFilterContainerComponent', () => {
  let component: ChartFilterContainerComponent;
  let fixture: ComponentFixture<ChartFilterContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartFilterContainerComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartFilterContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
