import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subject, takeUntil } from 'rxjs';
import { TableColumn } from './models/table-column';
import { LoaderService } from './services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [LoaderService]
})
export class AppComponent implements OnInit, OnDestroy {

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
  containerType: string = '';
  invertColors = false;
  destroy$: Subject<string> = new Subject<string>();
  constructor(public loaderService: LoaderService, public cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.loaderService.getLoaderState().
      pipe(takeUntil(this.destroy$)).subscribe(response => {
        this.showLoader = response;
        this.cdRef.detectChanges();
      });
  }

  onTabChange(event: MatTabChangeEvent) {
    switch (event.index) {
      case 1:
        this.containerType = 'bar';
        break;
      case 2:
        this.containerType = 'scatter';
        break;
      default:
        this.containerType = 'table';
    }
  }

  onInvertColor(invertColors: boolean) {
    this.invertColors = invertColors;
    document.documentElement.classList.toggle('dark-mode');
  }

  ngOnDestroy() {
    this.destroy$.next('');
    this.destroy$.complete();
  }

}
