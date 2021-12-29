import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Subject, takeUntil } from 'rxjs';
import { ErrorConstants } from '../../../constants/app.constants';

import { CustomerModelService } from '../../services/customer-model.service';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html'
})
export class ChartContainerComponent implements OnInit, OnDestroy {

  barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  barChartType: ChartType = 'bar';
  barChartLegend = false;
  barChartLabels = ['', ''];
  barChartData = [
    { data: [0, 0, 0, 0, 0], label: '' },
    { data: [0, 0, 0, 0, 0], label: '' }
  ];

  scatterChartOptions: ChartOptions = {
    responsive: true,
  };
  scatterChartData = [
    {
      data: [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
      ],
      label: '',
      pointRadius: 0
    },
  ];
  scatterChartType: ChartType = 'scatter';


  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  chartData: Array<any> = [];
  chartOptions: any = {};
  @Input('chartType') chartType: string = '';
  destroy$: Subject<string> = new Subject<string>();

  constructor(public customerModelService: CustomerModelService, public loaderService: LoaderService, public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.customerModelService.getChartData().pipe(takeUntil(this.destroy$)).subscribe(response => {
      this.chartData = response.chartData;
      this.chartType = response.chartType;
      this.chartOptions = response.chartOptions || {};
      this.loaderService.triggerLoader(true, 'chart-container');
      if (this.chartType === 'bar') {
        this.parseBarChartSeries();
      } else {
        this.parseScatterChartSeries();
      }
    }, error => {
      this.showNotificationOnError(ErrorConstants.CUSTOMER_DATA_LOAD_ERROR);
    });
  }

  parseBarChartSeries() {
    this.barChartLabels.length = 0;
    this.barChartData.length = 0;
    const seriesData = [{
      field: 'avgAccBalance',
      label: 'Average Account Balance'
    }, {
      field: 'avgTenure',
      label: 'Average Relationship Tenure'
    }];
    seriesData.forEach(series => {
      this.barChartData.push({
        label: series.label,
        data: this.getSeriesData(series.field)
      });
    });
    this.barChartLabels = [...this.barChartLabels];
    this.barChartData = JSON.parse(JSON.stringify(this.barChartData));
    this.barChartLegend = true;
    this.chart.update();
    this.loaderService.triggerLoader(false, 'chart-container');
  }

  getSeriesData(field: string) {
    const seriesData: Array<any> = [];
    this.chartData.forEach((data) => {
      seriesData.push(data[field]);
      if (this.barChartLabels.indexOf(data._id) < 0) {
        this.barChartLabels.push(data._id);
      }
    });
    return seriesData;
  }

  parseScatterChartSeries() {
    if (this.chartData && this.chartOptions.yaxis && this.chartOptions.xaxis) {
      this.scatterChartData[0].data.length = 0;
      this.scatterChartData[0].label = `${this.chartOptions.yaxis.header} VS ${this.chartOptions.xaxis.header}`;
      this.scatterChartData[0].pointRadius = 10;
      this.chartData.forEach((data) => {
        this.scatterChartData[0].data.push({
          x: data[this.chartOptions.xaxis.field],
          y: data[this.chartOptions.yaxis.field]
        });
      });
      this.chart.update();
    }
    this.loaderService.triggerLoader(false, 'chart-container');
  }

  showNotificationOnError(message: string) {
    this.loaderService.showSnackbar(this.snackBar, message);
    this.loaderService.triggerLoader(false, 'chart-container');
  }

  ngOnDestroy() {
    this.destroy$.next('');
    this.destroy$.complete();
  }

}
