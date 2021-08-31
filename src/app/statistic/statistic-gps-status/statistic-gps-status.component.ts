import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableData } from 'src/app/shared/truckassist-table/models/truckassist-table';
import { DatePipe } from '@angular/common';
import { StatisticService } from 'src/app/core/services/statistic.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-statistic-gps-status',
  templateUrl: './statistic-gps-status.component.html',
  styleUrls: ['./statistic-gps-status.component.scss'],
  providers: [DatePipe],
})
export class StatisticGPSStatusComponent implements OnInit, AfterViewInit, OnDestroy {
  charts = [];
  customHtml;
  loaded = false;
  lengthBodyTooltip;
  areaChartType = false;
  tooltipFinishedDriver = true;
  tooltipFinishedBroker = true;
  /* Query params */
  params = {
    dateFrom: '',
    dateTo: '',
    type: '',
  };
  /* Last Active Tooltip  */
  lastActiveDriverToolbar;
  lastActiveBrokerToolbar;
  /* Last Active Chart Element */
  lastActiveElement;
  allOtherElementsDriver;
  lastActiveElementBroker;
  allOtherElementsBroker;
  /* Dummy Driver List for Doug Chart */
  driverList = [
    {
      driverId: 0,
      name: 'R. Sanchez',
      moving: '7d 16h',
      stop: '10h 26m',
      extended: '11d 21h',
      parking: '10h 25m',
      active: false,
    },
    {
      driverId: 1,
      name: 'A. Trotter',
      moving: '7d 16h',
      stop: '10h 26m',
      extended: '11d 21h',
      parking: '10h 25m',
      active: false,
    },
    {
      driverId: 2,
      name: 'J. Smith',
      moving: '7d 16h',
      stop: '10h 26m',
      extended: '11d 21h',
      parking: '10h 25m',
      active: false,
    },
    {
      driverId: 3,
      name: 'B. White',
      moving: '7d 16h',
      stop: '10h 26m',
      extended: '11d 21h',
      parking: '10h 25m',
      active: false,
    },
    {
      driverId: 4,
      name: 'F. Gustavo',
      moving: '7d 16h',
      stop: '10h 26m',
      extended: '11d 21h',
      parking: '10h 25m',
      active: false,
    },
    {
      driverId: 5,
      name: 'W. Hanks',
      moving: '7d 16h',
      stop: '10h 26m',
      extended: '11d 21h',
      parking: '10h 25m',
      active: false,
    },
    {
      driverId: 6,
      name: 'M. Scott',
      moving: '7d 16h',
      stop: '10h 26m',
      extended: '11d 21h',
      parking: '10h 25m',
      active: false,
    },
    {
      driverId: 7,
      name: 'J. Pinkman',
      moving: '7d 16h',
      stop: '10h 26m',
      extended: '11d 21h',
      parking: '10h 25m',
      active: false,
    },
    {
      driverId: 8,
      name: 'D.K. Schrute',
      moving: '7d 16h',
      stop: '10h 26m',
      extended: '11d 21h',
      parking: '10h 25m',
      active: false,
    },
  ];
  /* Dummy State List for Doug Chart */
  brokerList = [
    {
      driverId: 0,
      name: '#784365',
      moving: '24d 15h',
      stop: '3d 15h',
      extended: '7d 1h',
      parking: '19h 39m',
      active: false,
    },
    {
      driverId: 1,
      name: '#298429',
      moving: '24d 15h',
      stop: '3d 15h',
      extended: '7d 1h',
      parking: '19h 39m',
      active: false,
    },
    {
      driverId: 2,
      name: '#923847',
      moving: '24d 15h',
      stop: '3d 15h',
      extended: '7d 1h',
      parking: '19h 39m',
      active: false,
    },
    {
      driverId: 3,
      name: '#972362',
      moving: '24d 15h',
      stop: '3d 15h',
      extended: '7d 1h',
      parking: '19h 39m',
      active: false,
    },
  ];

  /* Charts  */
  @ViewChild('chartBar') chartBar: any;
  @ViewChild('chartDoug') chartDoug: any;
  @ViewChild('chartDougBroker') chartDougBroker: any;
  /* Randomize Bar and Line Data */
  randoms1 = [
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
  ];
  randoms2 = [
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 30,
    },
  ];
  randoms3 = [
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 10,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 10,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 10,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 10,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 10,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 10,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 10,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 10,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 10,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 10,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 10,
    },
    {
      x: 134,
      y: 20,
    },
    {
      x: 213,
      y: 20,
    },
    {
      x: 324,
      y: 30,
    },
    {
      x: 672,
      y: 10,
    },
  ];
  randoms4 = [
    {
      x: 134,
      y: 40,
    },
    {
      x: 213,
      y: 40,
    },
    {
      x: 324,
      y: 10,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 40,
    },
    {
      x: 213,
      y: 40,
    },
    {
      x: 324,
      y: 10,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 40,
    },
    {
      x: 213,
      y: 40,
    },
    {
      x: 324,
      y: 10,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 40,
    },
    {
      x: 213,
      y: 40,
    },
    {
      x: 324,
      y: 10,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 40,
    },
    {
      x: 213,
      y: 40,
    },
    {
      x: 324,
      y: 10,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 40,
    },
    {
      x: 213,
      y: 40,
    },
    {
      x: 324,
      y: 10,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 40,
    },
    {
      x: 213,
      y: 40,
    },
    {
      x: 324,
      y: 10,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 40,
    },
    {
      x: 213,
      y: 40,
    },
    {
      x: 324,
      y: 10,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 40,
    },
    {
      x: 213,
      y: 40,
    },
    {
      x: 324,
      y: 10,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 40,
    },
    {
      x: 213,
      y: 40,
    },
    {
      x: 324,
      y: 10,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 40,
    },
    {
      x: 213,
      y: 40,
    },
    {
      x: 324,
      y: 10,
    },
    {
      x: 672,
      y: 30,
    },
    {
      x: 134,
      y: 40,
    },
    {
      x: 213,
      y: 40,
    },
    {
      x: 324,
      y: 10,
    },
    {
      x: 672,
      y: 30,
    },
  ];
  randoms = [this.randoms1, this.randoms2, this.randoms3, this.randoms4];
  randomstring = [...Array(48)].map(() => 'June ' + Math.floor(Math.random() * 9) + 'th, 2019');

  /* Data Bar Chart */
  dataBar: any = {
    hover: {
      intersect: false,
    },
    labels: this.randomstring,
    datasets: [
      {
        label: 'Moving',
        data: this.randoms1,
        backgroundColor: '#24C1A1c6',
        borderColor: '#24C1A1c6',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#ffffff00',
        pointHoverBackgroundColor: '#ffffff00',
        borderRadius: 2,
        borderWidth: 0,
        barPercentage: 0.5,
        categoryPercentage: 1,
        order: 0,
      },
      {
        label: 'Stop',
        data: this.randoms2,
        backgroundColor: '#5673AAc6',
        borderColor: '#5673AAc6',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#ffffff00',
        pointHoverBackgroundColor: '#ffffff00',
        borderRadius: 5,
        borderWidth: 0,
        borderSkipped: false,
        barPercentage: 0.5,
        categoryPercentage: 1,
        order: 1,
      },
      {
        label: 'Extended',
        data: this.randoms3,
        backgroundColor: '#FFA24Ec6',
        borderColor: '#FFA24Ec6',
        pointBorderColor: '#ffffff00',
        pointBackgroundColor: '#ffffff00',
        pointHoverBorderColor: '#ffffff00',
        pointHoverBackgroundColor: '#ffffff00',
        pointBorderWidth: 3,
        borderRadius: 0.5,
        borderWidth: 0,
        barPercentage: 0.5,
        categoryPercentage: 1,
        order: 2,
      },
      {
        label: 'Parking',
        data: this.randoms4,
        backgroundColor: '#6C6C6Cc6',
        borderColor: '#6C6C6Cc6',
        pointBorderColor: '#ffffff00',
        pointBackgroundColor: '#ffffff00',
        pointHoverBorderColor: '#ffffff00',
        pointHoverBackgroundColor: '#ffffff00',
        pointBorderWidth: 3,
        borderRadius: 0.5,
        borderWidth: 0,
        barPercentage: 0.5,
        categoryPercentage: 1,
        order: 3,
      },
    ],
  };
  /* Options Bar Chart */
  optionsBar: any = {
    plugins: false,
    responsive: true,
    hover: {},
    parsing: false,
    scales: {
      xAxes: [
        {
          stacked: true,
          gridLines: {
            display: false,
            offsetGridLines: true,
          },
          ticks: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
            max: 100,
          },
        },
      ],
    },
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    tooltips: {
      enabled: false,
      yAlign: 'top',
      mode: 'x-axis',
      position: 'average',
      intersect: false,
      callbacks: {
        label: (tooltipItem, data) => {
          if (data) {
            let width;
            const item = data?.datasets[tooltipItem.datasetIndex]?.data[tooltipItem.index];
            const type = data?.datasets[tooltipItem.datasetIndex]?._meta[0]?.type;
            const label = data?.datasets[tooltipItem.datasetIndex]?.label;
            const i = 100;
            for (let index = 0; index < i; index++) {
              width = data?.datasets[0]?._meta[index]?.data[0]?._model.width;
              if (width > 0) {
                break;
              }
            }
            return { item, type, label, width };
          }
        },
      },
      custom(tooltipModel) {
        let tooltipEl = document.getElementById('chartjs-tooltip-gps') as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-gps';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_statistics_gps"></div>';
          // document.body.appendChild(tooltipEl);
          document.getElementById('chart-group-gps-statistics').appendChild(tooltipEl);
        }
        // Hide if no tooltip
        if (tooltipModel.opacity === 0) {
          tooltipEl.style.opacity = '0';
          return;
        }

        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltipModel.yAlign) {
          tooltipEl.classList.add(tooltipModel.yAlign);
        } else {
          tooltipEl.classList.add('no-transform');
        }

        function getBody(bodyItem) {
          return bodyItem.lines;
        }

        // Set Text
        if (tooltipModel.body) {
          const title = tooltipModel.title;
          const bodyLines = tooltipModel.body.map(getBody);
          let innerHtml = '<div style="display: -webkit-box; -webkit-box-orient: vertical;">';
          this.lengthBodyTooltip = bodyLines.length;
          let titleDirection = '';
          if (tooltipModel.dataPoints[0].x > 40 && tooltipModel.dataPoints[0].x < 1350) {
            titleDirection = '';
          } else if (tooltipModel.dataPoints[0].x < 40) {
            titleDirection = 'right';
          } else {
            titleDirection = 'left';
          }

          bodyLines.forEach((body, i) => {
            let growItem = '';
            let theClass = '';
            switch (body[0].label) {
              case 'Moving':
                growItem = 'Moving';
                theClass = 'moving';
                break;
              case 'Stop':
                growItem = 'Stop';
                theClass = 'stop';
                break;
              case 'Extended':
                growItem = 'Ext. Stop';
                theClass = 'extended';
                break;
              case 'Parking':
                growItem = 'Parking';
                theClass = 'parking';
                break;
              default:
                break;
            }
            innerHtml += `<p class="${theClass}">
                                      ${growItem}
                                      <span class="value"> ${body[0].item.x}d 14h</span>
                                      <span class="per"> ${body[0].item.y}%</span>
                                  </p>`;
          });
          innerHtml += '</div>';
          innerHtml += `<p class="title ${titleDirection}">${title}</p>`;

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_statistics_gps');
          tableRoot.innerHTML = innerHtml;
        }
        tooltipEl.classList.remove('above', 'below', 'no-transform');

        if (tooltipModel.yAlign) {
          if (this.lengthBodyTooltip === 4) {
            tooltipEl.className = 'custom-caret-three';
          }
          if (this.lengthBodyTooltip === 3) {
            tooltipEl.className = 'custom-caret';
          }
          if (this.lengthBodyTooltip === 2) {
            tooltipEl.className = 'custom-caret-two';
          }
          if (this.lengthBodyTooltip === 1) {
            tooltipEl.className = 'custom-caret-one';
          }
        } else {
          tooltipEl.classList.add('no-transform');
        }
        if (tooltipModel.dataPoints[0].x > 1200) {
          tooltipEl.classList.add('switch-tooltip');
        } else {
          tooltipEl.classList.remove('switch-tooltip');
        }
        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font
        tooltipEl.style.width = tooltipModel.body[0].lines[0].width + 'px';
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '1';
        tooltipEl.style.left = tooltipModel.caretX + 'px';
        tooltipEl.style.top = '256px';
        tooltipEl.style.pointerEvents = 'none';
      },
    },
  };
  /* Filters Data */
  public loadingItems = false;
  public loadingItemsBroker = false;
  public selectedTab = '';
  public selectedTabBroker = '';
  public selectedTabDriver = '';
  /* Filter Dummy Data */
  tableData: TableData[] = [
    {
      title: 'Driver',
      field: 'driver',
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      extended: false,
      selectTab: true,
      tabFilters: [
        { id: 'Driver One' },
        { id: 'Driver One2' },
        { id: 'Driver One3' },
        { id: 'Driver One4' },
        { id: 'Driver One5' },
        { id: 'Driver One6' },
        { id: 'Driver One7' },
        { id: 'Driver One8' },
        { id: 'Driver One9' },
        { id: 'Driver One10' },
      ],
      gridNameTitle: 'Drivers',
      stateName: 'statistic_drivers',
    },
    {
      title: 'Truck',
      field: 'truck',
      data: [1, 2, 3],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 1 }, { id: 2 }, { id: 3 }],
      showToolsDropDown: true,
      gridNameTitle: 'Trucks',
      stateName: 'statistic_trucks',
    },
    {
      title: 'Truck type',
      field: 'trucktype',
      data: [1, 2, 3, 4],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      gridNameTitle: 'Truck Types',
      stateName: 'statistic_truck_types',
    },
    {
      title: 'State',
      field: 'state',
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      extended: false,
      selectTab: true,
      tabFilters: [
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
        { id: 10 },
      ],
      gridNameTitle: 'States',
      stateName: 'statistic_states',
    },
  ];

  /* Dummy Data for widgets */
  widgetsData = [
    { i: 0, indexId: 0, num: '6m 5d', per: '42.5%', title: 'Moving', active: true },
    { i: 1, indexId: 1, num: '27d 6h', per: '6.4%', title: 'Stop', active: true },
    { i: 2, indexId: 2, num: '6m 8d', per: '43.1%', title: 'Ext. Stop', active: true },
    { i: 3, indexId: 3, num: '1m 2d', per: '8.0%', title: 'Parking', active: true },
  ];
  /* Min Max Dummy data */
  minMaxData = [
    {
      dateLow: '04/07/19 - 04/15/19',
      dateHigh: '01/03/21 - 01/11/21',
      countLow: '57d 3h',
      countHigh: '75d 14h',
      title: 'Moving',
    },
    {
      dateLow: '07/21/19 - 07/29/19',
      dateHigh: '10/06/20 - 10/14/20',
      countLow: '9h 43m',
      countHigh: '12h 17m',
      title: 'Short Stop',
    },
    {
      dateLow: '07/21/19 - 07/29/19',
      dateHigh: '10/06/20 - 10/14/20',
      countLow: '52d 3h',
      countHigh: '69d 23h',
      title: 'Extended Stop',
    },
    {
      dateLow: '12/30/19 - 01/06/20',
      dateHigh: '03/27/20 - 04/02/20',
      countLow: '0m',
      countHigh: '17h 36m',
      title: 'Parking',
    },
  ];
  hoveredIndex = -1;
  /* Normal and hover background color for doughnout charts */
  chartCollors: any = [
    {
      hovered: '#24C1A1',
      normal: '#24C1A142',
      original: '#24C1A1c7',
    },
    {
      hovered: '#5673AA',
      normal: '#5673AA42',
      original: '#5673AAc7',
    },
    {
      hovered: '#FFA24E',
      normal: '#FFA24E42',
      original: '#FFA24Ec7',
    },
    {
      hovered: '#6C6C6C',
      normal: '#6C6C6C42',
      original: '#6C6C6Cc7',
    },
  ];
  /* Doug Chart Driver */
  type = 'doughnut';
  typeBroker = 'doughnut';
  data: any = {
    labels: [],
    datasets: [
      {
        data: [23, 54, 56, 23, 94, 23, 54, 23, 56],
        backgroundColor: [
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
        ],
        borderWidth: 4,
      },
      {
        data: [3, 2, 6, 8, 9, 10, 2, 4, 6],
        backgroundColor: [
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
        ],
        borderWidth: 4,
      },
      {
        data: [4, 1, 3, 7, 5, 6, 4, 9, 3],
        backgroundColor: [
          '#FFA24Ec7',
          '#FFA24Ec7',
          '#FFA24Ec7',
          '#FFA24Ec7',
          '#FFA24Ec7',
          '#FFA24Ec7',
          '#FFA24Ec7',
          '#FFA24Ec7',
          '#FFA24Ec7',
        ],
        borderWidth: 4,
      },
      {
        data: [3, 2, 3, 6, 5, 6, 4, 8, 2],
        backgroundColor: [
          '#6C6C6Cc7',
          '#6C6C6Cc7',
          '#6C6C6Cc7',
          '#6C6C6Cc7',
          '#6C6C6Cc7',
          '#6C6C6Cc7',
          '#6C6C6Cc7',
          '#6C6C6Cc7',
          '#6C6C6Cc7',
        ],
        borderWidth: 4,
      },
    ],
  };
  /* Doug Chart Broker */
  dataBroker: any = {
    labels: [],
    datasets: [
      {
        data: [4, 2, 6, 8, 9, 10, 2, 4, 6],
        backgroundColor: [
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
        ],
        borderWidth: 4,
      },
      {
        data: [23, 54, 56, 23, 94, 23, 54, 23, 56],
        backgroundColor: [
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
        ],
        borderWidth: 4,
      },
      {
        data: [3, 2, 3, 6, 5, 6, 4, 8, 2],
        backgroundColor: [
          '#FFA24Ec7',
          '#FFA24Ec7',
          '#FFA24Ec7',
          '#FFA24Ec7',
          '#FFA24Ec7',
          '#FFA24Ec7',
          '#FFA24Ec7',
          '#FFA24Ec7',
          '#FFA24Ec7',
        ],
        borderWidth: 4,
      },
      {
        data: [4, 1, 3, 7, 5, 6, 4, 9, 3],
        backgroundColor: [
          '#6C6C6Cc7',
          '#6C6C6Cc7',
          '#6C6C6Cc7',
          '#6C6C6Cc7',
          '#6C6C6Cc7',
          '#6C6C6Cc7',
          '#6C6C6Cc7',
          '#6C6C6Cc7',
          '#6C6C6Cc7',
        ],
        borderWidth: 4,
      },
    ],
  };
  /* Options for Doug Driver Chart */
  options: any = {
    responsive: true,
    plugins: false,
    maintainAspectRatio: false,
    cutoutPercentage: 60,
    legend: false,
    events: ['mousemove', 'mouseout'],
    onHover: (e, activeElements) => {
      if (activeElements.length === 1) {
        this.hoveredIndex = activeElements[0]._datasetIndex;
        activeElements[0]._options.backgroundColor = this.chartCollors[this.hoveredIndex].hovered;
      } else {
        this.hoveredIndex = -1;
      }
    },
    hover: { mode: null },
    tooltips: {
      callbacks: {
        label(tooltipItem, data) {
          // get the concerned dataset
          const dataset = data.datasets[tooltipItem.datasetIndex];
          // calculate the total of this data set
          const total = dataset.data.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
          });
          // get the current items value
          const currentValues = dataset.data[tooltipItem.index];
          // calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
          const percentage = Math.floor((currentValues / total) * 100 + 0.5);
          return percentage + '%';
        },
      },
      enabled: false,
      custom(tooltipModel) {
        let tooltipEl = document.getElementById(
          'chartjs-tooltip-gsp-doughnut-drivers'
        ) as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-gsp-doughnut-drivers';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_drivers_gps"></div>';
          document.getElementById('chart-doughnut-one-gps-statistics').appendChild(tooltipEl);
        }

        // Hide if no tooltip
        if (tooltipModel.opacity === 0) {
          tooltipEl.style.opacity = '0';
          return;
        }

        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        tooltipEl.classList.add(tooltipModel.yAlign);
        tooltipEl.classList.add(tooltipModel.xAlign);

        // Find Y Location on page
        let top;
        if (tooltipModel.yAlign === 'above') {
          top = tooltipModel.y - tooltipModel.caretHeight - tooltipModel.caretPadding;
        } else {
          top = tooltipModel.y + tooltipModel.caretHeight + tooltipModel.caretPadding;
        }

        function getBody(bodyItem) {
          return bodyItem.lines;
        }

        // Set Text
        if (tooltipModel.body) {
          const bodyLines = tooltipModel.body.map(getBody);

          let innerHtml = '<div>';

          bodyLines.forEach((body, i) => {
            innerHtml += `<p class="driver-per">
                                ${body}
                            </p>`;
          });
          innerHtml += '</div>';

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_drivers_gps');
          tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '200';
        tooltipEl.style.left = '155px';
        tooltipEl.style.top = '100px';
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.transition = '0.35s all';
      },
    },
  };
  /* Options for Doug Broker Chart */
  optionsBroker: any = {
    responsive: true,
    plugins: false,
    maintainAspectRatio: false,
    cutoutPercentage: 60,
    legend: false,
    events: ['mousemove', 'mouseout'],
    onHover: (e, activeElements) => {
      if (activeElements.length === 1) {
        this.hoveredIndex = activeElements[0]._datasetIndex;
        activeElements[0]._options.backgroundColor = this.chartCollors[this.hoveredIndex].hovered;
      } else {
        this.hoveredIndex = -1;
      }
    },
    hover: { mode: null },
    tooltips: {
      callbacks: {
        label(tooltipItem, data) {
          // get the concerned dataset
          const dataset = data.datasets[tooltipItem.datasetIndex];
          // calculate the total of this data set
          const total = dataset.data.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
          });
          // get the current items value
          const currentValues = dataset.data[tooltipItem.index];
          // calculate the precentage based on the total and current item, also this does a rough rounding to give a whole number
          const percentage = Math.floor((currentValues / total) * 100 + 0.5);
          return percentage + '%';
        },
      },
      // mode: 'label',
      enabled: false,
      custom(tooltipModel) {
        let tooltipEl = document.getElementById(
          'chartjs-tooltip-gps-doughnut-drokers'
        ) as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-gps-doughnut-drokers';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_drivers_gps"></div>';
          document.getElementById('chart-doughnut-two-gps-statistics').appendChild(tooltipEl);
        }

        // Hide if no tooltip
        if (tooltipModel.opacity === 0) {
          tooltipEl.style.opacity = '0';
          return;
        }

        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltipModel.yAlign) {
          tooltipEl.classList.add(tooltipModel.yAlign);
        } else {
        }
        tooltipEl.classList.add('no-transform');

        function getBody(bodyItem) {
          return bodyItem.lines;
        }

        // Set Text
        if (tooltipModel.body) {
          const bodyLines = tooltipModel.body.map(getBody);

          let innerHtml = '<div>';

          bodyLines.forEach((body, i) => {
            innerHtml += `<p class="driver-per">
                                ${body}
                            </p>`;
          });
          innerHtml += '</div>';

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_drivers_gps');
          tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font

        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '200';
        tooltipEl.style.left = '155px';
        tooltipEl.style.top = '100px';
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.transition = '0.3s all';
      },
    },
  };

  /* Chart Types to send to Parent for navigation */
  chartTypeData = [
    {
      id: 'bar',
      name: 'Bar',
      checked: true,
    },
    {
      id: 'area',
      name: 'Area',
      checked: false,
    },
  ];
  /* Data for doughnut chart dropdown filter */
  selectedDoughnutChartType = 'broker';
  selectedDoughnutChartTypeTwo = 'shipper';
  doughnutChartDataTypes: any = [
    {
      id: 1,
      name: 'Broker',
      value: 'broker',
    },
    {
      id: 2,
      name: 'Shipper',
      value: 'shipper',
    },
    {
      id: 3,
      name: 'State',
      value: 'state',
    },
  ];
  private destroy$: Subject<void> = new Subject<void>();

  constructor(public datepipe: DatePipe, private service: StatisticService) {}

  ngOnInit(): void {
    Chart.plugins.unregister(ChartDataLabels);
    /* Update chart types for parent */
    this.service.updateChartTypeData(this.chartTypeData);
    /* Subscribe on the service to always get chart type selection from parent component */
    this.service
      .getChartType()
      .pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        this.getAndSetChartTypes(type);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* Method for choosing what to do with charts after selection */
  getAndSetChartTypes(type) {
    this.widgetsData.forEach((element) => {
      element.active = true;
    });
    for (const i of [0, 1]) {
      this.chartBar.chart.getDatasetMeta(i).hidden = false;
    }
    switch (type) {
      case 'Bar':
        this.updateBarChart('bar', true);
        break;
      case 'Area':
        this.updateBarChart('line', false);
        break;
      default:
        break;
    }
  }

  updateBarChart(type: string, style: boolean) {
    this.chartBar.chart.config.type = type;
    this.chartBar.chart.update();
    this.chartBar.options.animation = true;
  }

  ngAfterViewInit() {
    this.setDoughChartStyle();
  }

  /* Method for filter clearing */
  clearAllFilters() {
    console.log('Clear.');
    console.log(this.chartBar);
  }

  /* Method for chart styles */
  setDoughChartStyle() {
    // console.log(this.chartDoug.chart);
  }

  /* Method for on click event - show tooltips doug chart */
  showDriverTooltip(dataId, i, chart) {
    const currentActive = dataId;
    if (chart === this.chartDoug) {
      this.driverList.forEach((element) => {
        element.active = false;
      });
      this.driverList[i].active = true;
      if (this.lastActiveDriverToolbar !== currentActive && this.lastActiveElement) {
        this.lastActiveElement.forEach((element, indexId) => {
          element._model.backgroundColor = this.chartCollors[indexId].normal;
        });
      }
    }
    if (chart === this.chartDougBroker) {
      this.brokerList.forEach((element) => {
        element.active = false;
      });
      this.brokerList[i].active = true;
      if (this.lastActiveBrokerToolbar !== currentActive && this.lastActiveElementBroker) {
        this.lastActiveElementBroker.forEach((element, indexId) => {
          element._model.backgroundColor = this.chartCollors[indexId].normal;
        });
      }
    }
    chart.chart.tooltip._active = [];
    chart.chart.tooltip.update(true);
    chart.chart.draw();
    if (chart.chart.tooltip._active === undefined) {
      chart.chart.tooltip._active = [];
    }
    const allOtherElements = [];
    allOtherElements.push(
      chart.chart.getDatasetMeta(0).data,
      chart.chart.getDatasetMeta(1).data,
      chart.chart.getDatasetMeta(2).data,
      chart.chart.getDatasetMeta(3).data
    );
    allOtherElements.forEach((element, indexId) => {
      element.forEach((element2) => {
        element2._model.backgroundColor = this.chartCollors[indexId].normal;
      });
    });
    const activeElements = chart.chart.tooltip._active;
    activeElements.push(
      chart.chart.getDatasetMeta(0).data[dataId],
      chart.chart.getDatasetMeta(1).data[dataId],
      chart.chart.getDatasetMeta(2).data[dataId],
      chart.chart.getDatasetMeta(3).data[dataId]
    );
    activeElements.forEach((element, indexId) => {
      element._model.backgroundColor = this.chartCollors[indexId].hovered;
    });
    chart.chart.tooltip._active = activeElements;
    chart.chart.tooltip.update(true);
    chart.chart.draw();
    if (chart === this.chartDoug) {
      this.lastActiveElement = activeElements;
      this.allOtherElementsDriver = allOtherElements;
      this.lastActiveDriverToolbar = dataId;
      this.tooltipFinishedDriver = false;
    }
    if (chart === this.chartDougBroker) {
      this.lastActiveElementBroker = activeElements;
      this.allOtherElementsBroker = allOtherElements;
      this.lastActiveBrokerToolbar = dataId;
      this.tooltipFinishedBroker = false;
    }
  }

  /* Method for removing tooltips and returning chart to original state */
  removeFilters(chart) {
    if (chart === this.chartDoug) {
      this.driverList.forEach((element) => {
        element.active = false;
      });
      this.lastActiveElement.forEach((element, indexId) => {
        element._model.backgroundColor = this.chartCollors[indexId].original;
      });
      this.allOtherElementsDriver.forEach((element, indexId) => {
        element.forEach((element2) => {
          element2._model.backgroundColor = this.chartCollors[indexId].original;
        });
      });
      this.tooltipFinishedDriver = true;
    }
    if (chart === this.chartDougBroker) {
      this.brokerList.forEach((element) => {
        element.active = false;
      });
      this.lastActiveElementBroker.forEach((element, indexId) => {
        element._model.backgroundColor = this.chartCollors[indexId].original;
      });
      this.allOtherElementsBroker.forEach((element, indexId) => {
        element.forEach((element2) => {
          element2._model.backgroundColor = this.chartCollors[indexId].original;
        });
      });
      this.tooltipFinishedBroker = true;
    }
    /* Draw Chart after update */
    chart.chart.tooltip._active = [];
    chart.chart.tooltip.update(true);
    chart.chart.draw();
  }

  /* Method for Bar Chart - Show or Hide a specific dataset with widgets */
  onClickShowHideDataset(chart, i, active) {
    this.widgetsData[i].active = !active;
    chart.chart.getDatasetMeta(i).hidden = active;
    chart.chart.update();
  }

  /* Filter Dates and switch datepicker views*/
  filterDoughnutChart(params, type) {
    if (type) {
      this.params.dateFrom = params.dateFrom;
      this.params.dateTo = params.dateTo;
      this.params.type = this.selectedDoughnutChartType;
      console.log(this.params);
    } else {
      this.params.dateFrom = params.dateFrom;
      this.params.dateTo = params.dateTo;
      this.params.type = this.selectedDoughnutChartTypeTwo;
      console.log(this.params);
    }
  }

  /* Method for switching tabs for doughnut chart types */
  changeDoughChartData(event, state) {
    switch (event) {
      case 'shipper':
        break;
      case 'broker':
        break;
      case 'state':
        break;
      default:
        break;
    }
    this.filterDoughnutChart(this.params, state);
  }
}
