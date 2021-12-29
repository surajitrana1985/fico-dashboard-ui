import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { CustomerData } from '../models/customer';
import { Pagination } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class CustomerModelService {

  API_URL = `${environment.EXPRESS_API_URL}/customers`;

  customerDataSubject = new BehaviorSubject<CustomerData>({ customers: [], totalRecords: 0 });
  customerFilterSubject = new BehaviorSubject<Object>({});
  customerPaginationSubject = new BehaviorSubject<Pagination>({ page: 1, limit: 5 });
  chartDataSubject = new BehaviorSubject<any>({});

  constructor(public http: HttpClient) { }

  getPaginatedTableData(options: Pagination, filters: Object) {
    const { page, limit } = options;
    const requestParam = {
      page,
      limit,
      filters
    };
    const url = `${this.API_URL}/customer-data`;
    return this.http.post(url, requestParam).pipe(map(response => response));
  }

  getUniqueTableColumnValues(field: string): Observable<Object> {
    const url = `${this.API_URL}/distinct`;
    return this.http.post(url, { field });
  }

  applyFilter(filterOptions: any, paginationOptions: Pagination) {
    const requestParam = {
      filterOptions,
      paginationOptions
    };
    const url = `${this.API_URL}/filter`;
    return this.http.post(url, requestParam);
  }

  applyChartFilter(filterOptions: any) {
    const url = `${this.API_URL}/filter-chart`;
    return this.http.post(url, filterOptions);
  }

  setCustomerModelData(value: CustomerData) {
    this.customerDataSubject.next(value);
  }

  getCustomerModelData(): Observable<CustomerData> {
    return this.customerDataSubject.asObservable();
  }

  setCustomerFilterData(value: Object) {
    this.customerFilterSubject.next(value);
  }

  getCustomerFilterData(): Observable<Object> {
    return this.customerFilterSubject.asObservable();
  }

  setCustomerPagination(value: Pagination) {
    this.customerPaginationSubject.next(value);
  }

  getCustomerPagination(): Observable<Pagination> {
    return this.customerPaginationSubject.asObservable();
  }

  setChartData(value: any) {
    this.chartDataSubject.next(value);
  }

  getChartData(): Observable<any> {
    return this.chartDataSubject.asObservable();
  }

}
