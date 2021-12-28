import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerModelService } from '../../services/customer-model.service';
import { TableColumn } from '../../models/table-column';
import { CustomerData } from '../../models/customer';
import { LoaderService } from '../../services/loader.service';
import { Pagination } from '../../models/pagination';
import { CommonUtils } from 'src/app/utils/common-utils';

@Component({
  selector: 'app-filter-container',
  templateUrl: './filter-container.component.html',
  styleUrls: ['./filter-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterContainerComponent implements OnInit, OnChanges {


  @Input('tableColumns') tableColumns: Array<TableColumn> = [];

  displayedColumns: Array<string> = ['Field', 'Operator', 'Value', 'Actions'];
  filterBtnLabel = 'Show Filters';

  isFilterShown = false;
  numFilters: Array<any> = [];
  fieldFilterNumericData: Array<TableColumn> = [];
  fieldFilterCategoricalData: Array<TableColumn> = [];

  numericFilterTypes = ['=', '!=', '>', '<', '>=', '<=', 'and', 'or', 'between', 'contains', '!contains'];
  rangeFilter = ['=', '!=', '>', '<', '>=', '<='];

  numericStepFilterTypes = ['and', 'or', 'between'];
  categoricalFilterTypes = ['=', '!=', 'contains', '!contains'];
  valueFilterDataCategorical: Array<string> = [];
  valueMultiSelect = false;
  disableFilter = false;

  filterMap: any = {
    'filter-0': {
      field: '', join: '', operators: this.numericFilterTypes, operator1: '', value1: '', operator2: '', value2: '', showOperator2: false
    },
    'filter-1': {
      field: '', join: '', operators: this.categoricalFilterTypes, operator1: '', value1: '', operator2: '', value2: '', showOperator2: false
    }
  };
  dataSource = new MatTableDataSource<any>([]);

  paginationOptions: Pagination = {
    page: 1,
    limit: 5
  };

  constructor(public customerModelService: CustomerModelService, public loaderService: LoaderService) { }

  ngOnInit(): void {
    this.customerModelService.getCustomerPagination().subscribe((paginationResponse: Pagination) => {
      this.paginationOptions = paginationResponse;
    });
  }

  ngOnChanges() {
    this.tableColumns.forEach(item => {
      if (item.type === 'numeric') {
        this.fieldFilterNumericData.push(item);
      } else {
        this.fieldFilterCategoricalData.push(item);
      }
    });
    this.populateFilters();
  }

  populateFilters() {
    for (let key of Object.keys(this.filterMap)) {
      this.numFilters.push(this.filterMap[key]);
    }
    this.dataSource = new MatTableDataSource<any>(this.numFilters);
  }

  onShowFilterChange(event: MatButtonToggleChange) {
    this.isFilterShown = event.source.checked;
    this.filterBtnLabel = event.source.checked ? 'Hide Filters' : 'Show Filters';
  }

  onFilterAdd() {
    this.numFilters.push(this.tableColumns[this.numFilters.length]);
    this.dataSource = new MatTableDataSource<any>(this.numFilters);
  }

  onFilterRemove() {
    this.numFilters.pop();
    this.dataSource = new MatTableDataSource<any>(this.numFilters);
  }

  selectColumnFilter(event: MatSelectChange, column: string, index: number) {
    if (column === 'field') {
      const fieldType = this.tableColumns.filter(item => item.field === event.value)[0].type;
      if (fieldType === 'categorical') {
        if (CommonUtils.shouldFetchDistinctCategorical(event.value)) {
          this.valueMultiSelect = true;
          this.customerModelService.getUniqueTableColumnValues(event.value).subscribe((data: any) => {
            this.valueFilterDataCategorical = data['distinctValues'];
          });
        } else {
          this.valueMultiSelect = false;
        }
      }
    }
    if (column === 'operator' && CommonUtils.isJoinOperator(this.numericStepFilterTypes, event.value)) {
      column = 'join';
      this.filterMap[`filter-${index}`].showOperator2 = true;
    } else {
      if (column === 'operator') {
        this.filterMap[`filter-${index}`].join = null;
        this.filterMap[`filter-${index}`].operator1 = null;
        this.filterMap[`filter-${index}`].operator2 = null;
        this.filterMap[`filter-${index}`].value2 = null;
        this.filterMap[`filter-${index}`].showOperator2 = false;
      }
    }
    this.filterMap[`filter-${index}`][column] = event.value;
  }

  onValueChange(event: any, column: string, index: number) {
    if (!this.numericStepFilterTypes.includes(this.filterMap[`filter-${index}`][column])) {
      this.filterMap[`filter-${index}`][`${column}`] = event.target.value;
    }
  }

  onApplyFilter() {
    this.disableFilter = true;
    this.loaderService.triggerLoader(true, 'filter-container');
    this.customerModelService.applyFilter(this.filterMap, this.paginationOptions).subscribe(response => {
      this.disableFilter = false;
      this.customerModelService.setCustomerModelData(response as CustomerData);
      this.customerModelService.setCustomerFilterData(this.filterMap);
    });
  }

}
