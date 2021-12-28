import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { CommonUtils } from 'src/app/utils/common-utils';
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

  numericStepFilterTypes = ['and', 'or', 'between'];
  fieldFilterCategoricalData: Array<TableColumn> = [];
  valueFilterDataCategorical: Array<string> = [];
  categoricalFieldData: Array<TableColumn> = [];
  filterMap: any = {};
  currentFilterField = '';

  constructor(public customerModelService: CustomerModelService, public loaderService: LoaderService) { }

  ngOnInit(): void { }

  ngOnChanges() {
    this.tableColumns.forEach(item => {
      if (item.type !== 'numeric' && CommonUtils.shouldFetchDistinctCategorical(item.field)) {
        this.fieldFilterCategoricalData.push(item);
        this.filterMap[item.field] = {
          values: [],
          selectedValues: []
        };
        this.getFilterValues(item.field);
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

  getFilterValues(field: string) {
    this.customerModelService.getUniqueTableColumnValues(field).subscribe((data: any) => {
      this.filterMap[field].values = data['distinctValues'];
    });
  }

  onApplyFilter() {
    this.loaderService.triggerLoader(true, 'chart-filter-container');
    this.customerModelService.applyChartFilter(this.filterMap).subscribe(response => {
      this.customerModelService.setChartData(response);
      this.loaderService.triggerLoader(false, 'chart-filter-container');
    });
  }

}
