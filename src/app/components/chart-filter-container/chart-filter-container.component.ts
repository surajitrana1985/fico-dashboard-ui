import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CommonUtils } from '../../utils/common-utils';
import { TableColumn } from '../../models/table-column';
import { CustomerModelService } from '../../services/customer-model.service';
import { LoaderService } from '../../services/loader.service';
import { ErrorConstants } from '../../../constants/app.constants';

@Component({
  selector: 'app-chart-filter-container',
  templateUrl: './chart-filter-container.component.html'
})
export class ChartFilterContainerComponent implements OnInit, OnChanges {

  @Input('tableColumns') tableColumns: Array<TableColumn> = [];
  @Input('chartType') chartType: string = '';

  numericStepFilterTypes = ['and', 'or', 'between'];
  fieldFilterCategoricalData: Array<TableColumn> = [];
  fieldFilterNumericData: Array<TableColumn> = [];
  valueFilterDataCategorical: Array<string> = [];
  categoricalFieldData: Array<TableColumn> = [];
  filterMap: any = {};
  currentFilterField = '';
  chartOptions: any = {
    xaxis: {
      field: '',
      header: '',
      type: ''
    },
    yaxis: {
      field: '',
      header: '',
      type: ''
    }
  };

  destroy1$: Subject<string> = new Subject<string>();
  destroy2$: Subject<string> = new Subject<string>();

  constructor(public customerModelService: CustomerModelService, public loaderService: LoaderService, public snackBar: MatSnackBar) { }

  ngOnInit(): void { }

  ngOnChanges() {
    this.tableColumns.forEach(item => {
      if (CommonUtils.shouldFetchDistinctCategorical(item)) {
        this.fieldFilterCategoricalData.push(item);
        this.filterMap[item.field] = {
          values: [],
          selectedValues: []
        };
        this.getFilterValues(item.field);
      } else if (CommonUtils.shouldFetchDistinctNumeric(item)) {
        this.fieldFilterNumericData.push(item);
      }
    });
    this.filterMap['groupby'] = '';
  }

  selectColumnFilter(event: MatSelectChange, column: string) {
    if (column === 'groupby') {
      this.filterMap[column] = event.value.field;
    } else {
      this.filterMap[column].selectedValues = event.value;
    }
  }

  selectPlotAxis(event: MatSelectChange, axis: string) {
    this.chartOptions[axis] = event.value;
  }

  getFilterValues(field: string) {
    this.customerModelService.getUniqueTableColumnValues(field).
      pipe(takeUntil(this.destroy1$)).subscribe((data: any) => {
        this.filterMap[field].values = data['distinctValues'];
      }, error => {
        this.showNotificationOnError(ErrorConstants.UNIQUE_DATA_LOAD_ERROR);
      });
  }

  onApplyFilter() {
    this.loaderService.triggerLoader(true, 'chart-filter-container');
    this.customerModelService.applyChartFilter(this.filterMap).
      pipe(takeUntil(this.destroy2$)).subscribe((response: any) => {
        this.customerModelService.setChartData({
          chartData: response.customers,
          chartType: this.chartType,
          chartOptions: this.chartOptions
        });
        this.loaderService.triggerLoader(false, 'chart-filter-container');
      }, error => {
        this.showNotificationOnError(ErrorConstants.CHART_FILTER_APPLY_ERROR);
      });
  }

  showNotificationOnError(message: string) {
    this.loaderService.showSnackbar(this.snackBar, message);
    this.loaderService.triggerLoader(false, 'chart-filter-container');
  }

  ngOnDestroy() {
    this.destroy1$.next('');
    this.destroy1$.complete();
    this.destroy2$.next('');
    this.destroy2$.complete();
  }

}
