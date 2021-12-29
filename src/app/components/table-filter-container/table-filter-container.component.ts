import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSelectChange } from '@angular/material/select';
import { CustomerData } from '../../models/customer';
import { Pagination } from '../../models/pagination';
import { TableColumn } from '../../models/table-column';
import { CustomerModelService } from '../../services/customer-model.service';
import { LoaderService } from '../../services/loader.service';
import { CommonUtils } from '../../utils/common-utils';

@Component({
  selector: 'app-table-filter-container',
  templateUrl: './table-filter-container.component.html',
  styleUrls: ['./table-filter-container.component.scss']
})
export class TableFilterContainerComponent implements OnInit, OnChanges {

  filterBtnLabel = 'Show Filters';
  fieldFilterData: Array<TableColumn> = [];
  numericFilterTypes = ['=', '!=', '>', '<', '>=', '<=', 'and', 'or', 'between'];
  categoricalFilterTypes = ['=', '!=', 'contains', '!contains'];
  rangeFilter = ['=', '!=', '>', '<', '>=', '<='];
  numericStepFilterTypes = ['and', 'or', 'between'];
  filterObj = {
    'numeric': {
      field: '', join: '', operators: this.numericFilterTypes, operator1: '',
      rangeOperators: this.rangeFilter, showOperator1: false,
      value1: '', operator2: '', value2: '', showOperator2: false,
      multiselect: false, values: [], type: '', header: ''
    },
    'categorical': {
      field: '', join: '', operators: this.categoricalFilterTypes, operator1: '',
      rangeOperators: null, showOperator1: false,
      value1: '', operator2: '', value2: '', showOperator2: false,
      multiselect: false, values: [], type: '', header: ''
    }
  };
  filterMap: any = {};

  @Input('tableColumns') tableColumns: Array<TableColumn> = [];

  filterFieldCollection: Array<any> = [];
  currentSelectedField: string = '';
  disableFilter = false;
  isFilterShown = false;

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
    this.addTableColumnsToDefaultFilterDropdown();
  }

  addTableColumnsToDefaultFilterDropdown() {
    this.tableColumns.forEach(item => {
      this.fieldFilterData.push(item);
    });
    this.sortFilterFieldData();
  }

  onFilterAdd() {
    const item: TableColumn = this.getFieldType(this.currentSelectedField);
    if (item) {
      this.filterMap[this.currentSelectedField] = item.type === 'numeric' ?
        Object.assign({}, this.filterObj.numeric) : Object.assign({}, this.filterObj.categorical);
      this.filterMap[this.currentSelectedField].type = item.type;
      this.filterMap[this.currentSelectedField].header = item.header;
      this.filterMap[this.currentSelectedField].field = this.currentSelectedField;
      if (item.type === 'categorical') {
        if (CommonUtils.shouldFetchCategorical(this.currentSelectedField)) {
          this.filterMap[this.currentSelectedField].multiselect = true;
          this.customerModelService.getUniqueTableColumnValues(this.currentSelectedField).subscribe((data: any) => {
            this.filterMap[this.currentSelectedField].values = data['distinctValues'];
          });
        } else {
          this.filterMap[this.currentSelectedField].multiselect = false;
        }
      }
      this.filterFieldCollection.push(this.filterMap[this.currentSelectedField]);
      this.fieldFilterData = this.fieldFilterData.filter(item => {
        return item.field !== this.currentSelectedField;
      });
    }
  }

  onShowFilterChange(event: MatButtonToggleChange) {
    this.isFilterShown = event.source.checked;
    this.filterBtnLabel = event.source.checked ? 'Hide Filters' : 'Show Filters';
    if (!this.isFilterShown) {
      this.filterMap = {};
      this.filterFieldCollection.length = 0;
      this.addTableColumnsToDefaultFilterDropdown();
    }
  }

  onApplyFilter() {
    const filterParam = CommonUtils.getCleanUpFilterParam(this.filterMap);
    this.disableFilter = true;
    this.loaderService.triggerLoader(true, 'filter-container');
    this.customerModelService.applyFilter(filterParam, this.paginationOptions).subscribe(response => {
      this.disableFilter = false;
      this.customerModelService.setCustomerModelData(response as CustomerData);
      this.customerModelService.setCustomerFilterData(this.filterMap);
    });
  }

  selectColumnFilter(event: MatSelectChange, column: string, field: string) {
    if (column === 'select') {
      this.currentSelectedField = event.value;
    } else if (column === 'operator' && CommonUtils.isJoinOperator(this.numericStepFilterTypes, event.value)) {
      column = 'join';
      this.filterMap[field]['join'] = event.value;
      if (this.filterMap[field]['join'] === 'between') {
        this.filterMap[field].operator1 = '>';
        this.filterMap[field].operator2 = '<';
      }
      this.filterMap[field].showOperator1 = true;
      this.filterMap[field].showOperator2 = true;
    } else {
      if (column === 'operator') {
        this.filterMap[field].join = null;
        this.filterMap[field].operator1 = null;
        this.filterMap[field].operator2 = null;
        this.filterMap[field].value2 = null;
        this.filterMap[field].showOperator2 = false;
      }
      this.filterMap[field][column] = event.value;
    }
  }

  getFieldType(field: string): TableColumn {
    return this.tableColumns.filter(item => item.field === field)[0];
  }

  onValueChange(event: any, column: string, field: string) {
    if (!this.numericStepFilterTypes.includes(this.filterMap[field][column])) {
      this.filterMap[field][`${column}`] = event.target.value;
      if (this.filterMap[field].join === 'between') {
        if (column === 'value1') {
          this.filterMap[field].operator1 = '>';
        } else if (column === 'value2') {
          this.filterMap[field].operator2 = '<';
        }
      }
    }
  }

  onRemoveFilter(filterItem: any) {
    delete this.filterMap[filterItem.field];
    this.filterFieldCollection = this.filterFieldCollection.filter(item => {
      return item.field !== filterItem.field;
    });
    this.fieldFilterData.push({
      field: filterItem.field,
      header: filterItem.header,
      type: filterItem.type
    });
    this.sortFilterFieldData();
  }

  sortFilterFieldData() {
    this.fieldFilterData.sort((itemA: TableColumn, itemB: TableColumn) => {
      if (itemA.field < itemB.field) {
        return -1;
      } else {
        return 1;
      }
    });
  }

}
