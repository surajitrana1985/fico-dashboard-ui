import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { CommonUtils } from '../../utils/common-utils';
import { TableColumn } from '../../models/table-column';
import { CustomerModelService } from '../../services/customer-model.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-chart-filter-container',
  templateUrl: './chart-filter-container.component.html',
  styleUrls: ['./chart-filter-container.component.scss']
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

  constructor(public customerModelService: CustomerModelService, public loaderService: LoaderService) { }

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
    this.customerModelService.getUniqueTableColumnValues(field).subscribe((data: any) => {
      this.filterMap[field].values = data['distinctValues'];
    });
  }

  onApplyFilter() {
    this.loaderService.triggerLoader(true, 'chart-filter-container');
    this.customerModelService.applyChartFilter(this.filterMap).subscribe((response: any) => {
      this.customerModelService.setChartData({
        chartData: response.customers,
        chartType: this.chartType,
        chartOptions: this.chartOptions
      });
      this.loaderService.triggerLoader(false, 'chart-filter-container');
    });
  }

  ngOnDestroy() {
    // this.destroy1$.next('');
    // this.destroy2$.complete();
  }

}
