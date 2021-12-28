import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CustomerModelService } from 'src/app/services/customer-model.service';
import { LoaderService } from 'src/app/services/loader.service';
@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss']
})
export class ChartContainerComponent implements OnInit {

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
        { x: 1, y: 1 },
        { x: 2, y: 3 },
        { x: 3, y: -2 },
        { x: 4, y: 4 },
        { x: 5, y: -3, r: 20 },
      ],
      label: 'Series A',
      pointRadius: 10,
    },
  ];
  scatterChartType: ChartType = 'scatter';

  chartData: Array<any> = [];

  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  constructor(public customerModelService: CustomerModelService, public loaderService: LoaderService) { }

  ngOnInit(): void {
    this.loaderService.triggerLoader(true);
    this.customerModelService.getChartData().subscribe(response => {
      if (response && response.customers) {
        this.chartData = response.customers;
        this.parseBarChartSeries();
        this.loaderService.triggerLoader(false);
      }
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
    console.log(this.barChartData, this.barChartLabels);
    this.barChartLegend = true;
    this.chart.update();
    this.loaderService.triggerLoader(false);
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

}
