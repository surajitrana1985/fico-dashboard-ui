import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Customer, CustomerData, DistinctValues } from '../models/customer';

import { Pagination } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class CustomerModelService {

  API_URL = 'http://localhost:9000/customers';

  // customerDataSubject = new BehaviorSubject<CustomerData>({ customers: [], totalRecords: 0 });

  constructor(public http: HttpClient) { }

  getPaginatedTableData(options: Pagination) {
    const { page, limit } = options;
    const url = `${this.API_URL}?page=${page}&limit=${limit}`;
    return this.http.get(url).pipe(map(response => response));
  }

  getUniqueTableColumnValues(field: string): Observable<Object> {
    const url = `${this.API_URL}/distinct`;
    return this.http.post(url, { field });
  }

  // setCustomerModelData(value: CustomerData) {
  //   this.customerDataSubject.next(value);
  // }

  // getCustomerModelData(): Observable<CustomerData> {
  //   return this.customerDataSubject.asObservable();
  // }

}
