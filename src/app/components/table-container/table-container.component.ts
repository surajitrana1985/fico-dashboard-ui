import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { Pagination } from '../../models/pagination';
import { CustomerModelService } from '../../services/customer-model.service';
import { LoaderService } from '../../services/loader.service';

import { Customer, CustomerData } from '../../models/customer';
import { TableColumn } from '../../models/table-column';

import { ErrorConstants } from '../../../constants/app.constants';

@Component({
  selector: 'app-table-container',
  templateUrl: './table-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableContainerComponent implements OnInit, OnChanges, OnDestroy {

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

  destroy1$: Subject<string> = new Subject<string>();
  destroy2$: Subject<string> = new Subject<string>();
  destroy3$: Subject<string> = new Subject<string>();

  constructor(public customerModelService: CustomerModelService,
    public loaderService: LoaderService,
    public cdRef: ChangeDetectorRef, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getTableData();
    this.customerModelService.getCustomerModelData().
      pipe(takeUntil(this.destroy1$)).subscribe((customerResponse) => {
        this.customerData = customerResponse as CustomerData;
        this.refreshData();
      }, (error) => {
        this.showNotificationOnError(ErrorConstants.CUSTOMER_DATA_LOAD_ERROR);
      });
    this.customerModelService.getCustomerFilterData().
      pipe(takeUntil(this.destroy2$)).subscribe((filterResponse) => {
        this.filterMap = filterResponse;
      }, (error) => {
        this.showNotificationOnError(ErrorConstants.CUSTOMER_DATA_LOAD_ERROR);
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
    this.loaderService.triggerLoader(false, 'table-container');
  }

  getTableData() {
    this.loaderService.triggerLoader(true, 'table-container');
    this.customerModelService.getPaginatedTableData(this.paginationOptions, this.filterMap).
      pipe(takeUntil(this.destroy3$)).subscribe((data) => {
        this.customerData = data as CustomerData;
        this.customerModelService.setCustomerPagination(this.paginationOptions);
        this.refreshData();
      }, error => {
        this.showNotificationOnError(ErrorConstants.CUSTOMER_DATA_LOAD_ERROR);
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

  showNotificationOnError(message: string) {
    this.loaderService.showSnackbar(this.snackBar, message);
    this.loaderService.triggerLoader(false, 'table-container');
  }

  ngOnDestroy() {
    this.destroy1$.next('');
    this.destroy1$.complete();
    this.destroy2$.next('');
    this.destroy2$.complete();
    this.destroy3$.next('');
    this.destroy3$.complete();
  }

}
