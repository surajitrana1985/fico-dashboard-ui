import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TableColumn } from './models/table-column';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoaderService]
})
export class AppComponent implements OnInit {

  showLoader = false;

  columns: Array<TableColumn> = [{
    field: 'customerId',
    header: 'Customer ID',
    type: 'numeric'
  }, {
    field: 'customerName',
    header: 'Customer Name',
    type: 'categorical'
  }, {
    field: 'age',
    header: 'Age',
    type: 'numeric'
  }, {
    field: 'qualification',
    header: 'Qualification',
    type: 'categorical'
  }, {
    field: 'income',
    header: 'Income',
    type: 'numeric'
  }, {
    field: 'workExp',
    header: 'Work Experience',
    type: 'numeric'
  }, {
    field: 'numHouseholds',
    header: 'Number of Households',
    type: 'numeric'
  }, {
    field: 'region',
    header: 'Region',
    type: 'categorical'
  }, {
    field: 'state',
    header: 'State',
    type: 'categorical'
  }, {
    field: 'address',
    header: 'Address',
    type: 'categorical'
  }, {
    field: 'accountBalance',
    header: 'Account Balance',
    type: 'numeric'
  }, {
    field: 'relationshipTenure',
    header: 'Relationship Tenure',
    type: 'numeric'
  }, {
    field: 'numAccounts',
    header: 'Number of accounts',
    type: 'numeric'
  }, {
    field: 'accountType',
    header: 'Account Type',
    type: 'categorical'
  }, {
    field: 'employmentStatus',
    header: 'Employment Status',
    type: 'categorical'
  }];

  customerData: any = {};
  filterLabel = 'Show Filter';
  showFilter = false;

  constructor(public loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.getLoaderState().subscribe(response => {
      this.showLoader = response;
    });
  }

}