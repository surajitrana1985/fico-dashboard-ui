import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { CustomerModelService } from '../../services/customer-model.service';
import { TableColumn } from '../../models/table-column';

@Component({
  selector: 'app-filter-container',
  templateUrl: './filter-container.component.html',
  styleUrls: ['./filter-container.component.scss']
})
export class FilterContainerComponent implements OnInit, OnChanges {


  @Input('tableColumns') tableColumns: Array<TableColumn> = [];

  displayedColumns: Array<string> = ['Field', 'Operator', 'Value', 'Actions'];
  filterBtnLabel = 'Show Filters';

  isFilterShown = false;
  numFilters: Array<any> = [];
  fieldFilterData: Array<TableColumn> = [];

  numericFilterTypes = ['=', '!=', '>', '<', '>=', '<=', 'and', 'or', 'between', 'contains', '!contains'];
  categoricalFilterTypes = ['=', '!=', 'contains', '!contains'];
  operatorFilterData: Array<string> = [];
  valueFilterData: Array<string> = [];
  valueMultiSelect = false;

  filterMap: any = {
    0: {
      field: '', operator: '', value1: '', value2: ''
    }
  };
  dataSource = new MatTableDataSource<any>([]);

  constructor(public customerModelService: CustomerModelService) { }

  ngOnInit(): void { }

  ngOnChanges() {
    this.tableColumns.forEach(item => {
      this.fieldFilterData.push(item);
    });
    this.populateFilters();
  }

  populateFilters() {
    for (let key of Object.keys(this.filterMap)) {
      this.numFilters.push(this.filterMap[key]);
    }
    console.log(this.numFilters);
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

  selectColumnFilter(event: MatSelectChange, row: any, column: string) {
    if (column === 'field') {
      const fieldType = this.tableColumns.filter(item => item.field === event.value)[0].type;
      this.operatorFilterData = fieldType === 'numeric' ?
        Array.from(this.numericFilterTypes) :
        Array.from(this.categoricalFilterTypes);
      if (fieldType === 'categorical') {
        if (this.shouldFetchDistinctCategorical(event.value)) {
          this.valueMultiSelect = true;
          this.customerModelService.getUniqueTableColumnValues(event.value).subscribe((data: any) => {
            this.valueFilterData = data['distinctValues'];
          });
        } else {
          this.valueMultiSelect = false;
        }
      }
    }
  }

  shouldFetchDistinctCategorical(field: string) {
    return field !== 'customerName' && field !== 'address';
  }

}
