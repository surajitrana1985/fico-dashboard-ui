import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Pagination } from '../../models/pagination';
import { CustomerModelService } from '../../services/customer-model.service';
import { LoaderService } from '../../services/loader.service';

import { Customer, CustomerData } from '../../models/customer';
import { TableColumn } from '../../models/table-column';

@Component({
  selector: 'app-table-container',
  templateUrl: './table-container.component.html',
  styleUrls: ['./table-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableContainerComponent implements OnInit, OnChanges {

  collectionSize = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  tableData: Array<Customer> = [];

  dataSource = new MatTableDataSource<any>(this.tableData);

  @Input('tableColumns') tableColumns: Array<TableColumn> = [];
  displayedColumns: Array<string> = [];

  customerData: CustomerData = {
    customers: [],
    totalRecords: 0
  };

  filterMap: any = {};

  paginationOptions: Pagination = {
    page: 1,
    limit: 5
  };
  pageEvent!: PageEvent;

  constructor(public customerModelService: CustomerModelService,
    public loaderService: LoaderService,
    public cdRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.getTableData();
    this.customerModelService.getCustomerModelData().subscribe((customerResponse) => {
      this.customerData = customerResponse as CustomerData;
      this.refreshData();
    });
    this.customerModelService.getCustomerFilterData().subscribe((filterResponse) => {
      this.filterMap = filterResponse;
    });
  }

  ngOnChanges() {
    if (this.tableColumns && this.tableColumns.length) {
      this.displayedColumns = this.tableColumns.map(item => item.field);
    }
  }

  refreshData() {
    this.tableData = this.customerData.customers;
    this.collectionSize = this.customerData.totalRecords;
    this.dataSource = new MatTableDataSource<any>(this.tableData);
    this.cdRef.detectChanges();
    this.loaderService.triggerLoader(false);
  }

  getTableData() {
    this.loaderService.triggerLoader(true);
    this.customerModelService.getPaginatedTableData(this.paginationOptions, this.filterMap).subscribe((data) => {
      this.customerData = data as CustomerData;
      this.customerModelService.setCustomerPagination(this.paginationOptions);
      this.refreshData();
    });
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  changePageSize(event: PageEvent) {
    this.paginationOptions = {
      page: event.pageIndex + 1,
      limit: event.pageSize
    };
    this.getTableData();
  }

}
