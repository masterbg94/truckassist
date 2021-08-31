import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableData } from 'src/app/shared/truckassist-table/models/truckassist-table';
import { DatePipe } from '@angular/common';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { environment } from 'src/environments/environment';
import { StatisticService } from 'src/app/core/services/statistic.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-statistic-fuel',
  templateUrl: './statistic-fuel.component.html',
  styleUrls: ['./statistic-fuel.component.scss'],
  providers: [DatePipe],
})
export class StatisticFuelComponent implements OnInit, AfterViewInit, OnDestroy {
  charts = [];
  customHtml;
  loaded = false;
  lengthBodyTooltip;
  tooltipFinishedDriver = true;
  tooltipFinishedBroker = true;
  fullcalendar: any;
  public calendarTitle = '';
  format: FormatSettings = environment.dateFormat;
  public selectedDate = null;
  /* Last Active Tooltip  */
  lastActiveDriverToolbar;
  lastActiveBrokerToolbar;
  /* Query params */
  params = {
    dateFrom: '',
    dateTo: '',
    type: '',
  };
  /* Last Active Chart Element */
  lastActiveElement;
  allOtherElementsDriver;
  lastActiveElementBroker;
  allOtherElementsBroker;
  /* Dummy Driver List for Doug Chart */
  driverList = [
    {
      driverId: 0,
      name: '#5342',
      gallons: '597',
      cost: '$25.0K',
      fuel: '$1,356',
      mpg: '$1,356',
      active: false,
    },
    {
      driverId: 1,
      name: '#5432',
      gallons: '457',
      cost: '$24.2K',
      fuel: '$1.231',
      mpg: '$1.231',
      active: false,
    },
    {
      driverId: 2,
      name: '#3245',
      gallons: '324',
      cost: '$24.2K',
      fuel: '$1.231',
      mpg: '$1.231',
      active: false,
    },
    {
      driverId: 3,
      name: '#5432',
      gallons: '542',
      cost: '$24.2K',
      fuel: '$1.231',
      mpg: '$1.231',
      active: false,
    },
    {
      driverId: 4,
      name: '#8722',
      gallons: '543',
      cost: '$24.2K',
      fuel: '$1.231',
      mpg: '$1.231',
      active: false,
    },
    {
      driverId: 5,
      name: '#8726',
      gallons: '235',
      cost: '$24.2K',
      fuel: '$1.231',
      mpg: '$1.231',
      active: false,
    },
    {
      driverId: 6,
      name: '#3242',
      gallons: '523',
      cost: '$24.2K',
      fuel: '$1.231',
      mpg: '$1.231',
      active: false,
    },
    {
      driverId: 7,
      name: '#6725',
      gallons: '324',
      cost: '$24.2K',
      fuel: '$1.231',
      mpg: '$1.231',
      active: false,
    },
    {
      driverId: 8,
      name: '#8723',
      gallons: '872',
      cost: '$24.2K',
      fuel: '$1.231',
      mpg: '$1.231',
      active: false,
    },
  ];
  /* Dummy Broker List for Doug Chart */
  brokerList = [
    {
      driverId: 0,
      name: 'Semi Truck',
      gallons: '4',
      cost: '$25.0K',
      fuel: '$1,356',
      mpg: '$1,356',
      active: false,
    },
    {
      driverId: 1,
      name: 'Semi /wSleeper',
      gallons: '4',
      cost: '$24.2K',
      fuel: '$1.231',
      mpg: '$1.231',
      active: false,
    },
    {
      driverId: 2,
      name: 'Box Truck',
      gallons: '3',
      cost: '$24.2K',
      fuel: '$1.231',
      mpg: '$1.231',
      active: false,
    },
    {
      driverId: 3,
      name: 'Cargo Van',
      gallons: '2',
      cost: '$24.2K',
      fuel: '$1.231',
      mpg: '$1.231',
      active: false,
    },
    {
      driverId: 4,
      name: 'Car Hauler',
      gallons: '1',
      cost: '$24.2K',
      fuel: '$1.231',
      mpg: '$1.231',
      active: false,
    },
    {
      driverId: 5,
      name: 'Tow Truck',
      gallons: '0',
      cost: '$0',
      fuel: '$0',
      mpg: '$0',
      active: false,
    },
  ];

  /* Charts  */
  @ViewChild('chartBar') chartBar: any;
  @ViewChild('chartLine') chartLine: any;
  @ViewChild('chartLine2') chartLine2: any;
  @ViewChild('chartDoug') chartDoug: any;
  @ViewChild('chartDougBroker') chartDougBroker: any;
  /* Randomize Bar and Line Data */
  randoms1 = [...Array(100)].map(() => Math.floor(Math.random() * 9) + 1);
  randoms2 = [...Array(100)].map(() => Math.floor(Math.random() * 5) + 1);
  randoms3 = [...Array(100)].map(() => Math.floor(Math.random() * 9));
  randomstring = [...Array(100)].map(() => 'Apr ' + Math.floor(Math.random() * 9) + 'th, 2019');
  randoms = [this.randoms1, this.randoms2, this.randoms3];
  /* Data Bar Chart */
  dataBar: any = {
    hover: {
      intersect: false,
    },
    labels: this.randomstring,
    datasets: [
      {
        label: 'Gallons',
        data: this.randoms1,
        backgroundColor: '#FFAD43c6',
        borderColor: '#FFAD43c6',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#FFAD43c6',
        borderWidth: 0,
        borderRadius: 50,
        borderSkipped: false,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
        order: 2,
      },
      {
        label: 'Cost',
        data: this.randoms2,
        backgroundColor: '#24C1A1c6',
        borderColor: '#24C1A1c6',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#24C1A1c6',
        borderWidth: 0,
        borderRadius: 50,
        categoryPercentage: 0.8,
        barPercentage: 0.5,
        order: 1,
      },
      {
        label: 'Fuel',
        data: this.randoms3,
        backgroundColor: '#5673AA',
        borderColor: '#5673AA',
        pointBorderColor: '#5673AA',
        pointBackgroundColor: '#fff',
        pointHoverBorderColor: '#5673AA',
        pointHoverBackgroundColor: '#5673AA',
        pointBorderWidth: 2,
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 4,
        borderRadius: 0.5,
        barPercentage: 0.6,
        categoryPercentage: 0.9,
        order: 0,
        type: 'line',
        fill: false,
      },
      {
        label: 'MPG',
        data: this.randoms3,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: 'rgba(0, 0, 0, 0)',
        pointHoverBackgroundColor: 'rgba(0, 0, 0, 0)',
        borderWidth: 0,
        borderRadius: 0,
        barPercentage: 0,
        order: 3,
      },
    ],
  };
  /* Options Bar Chart */
  optionsBar: any = {
    responsive: true,
    hover: {},
    plugins: false,
    layout: {
      padding: {
        right: 12,
      },
    },
    scales: {
      xAxes: [
        {
          id: 'bar-x-axis1',
          stacked: true,
          gridLines: {
            display: false,
            offsetGridLines: true,
          },
          ticks: {
            display: false,
          },
        },
        {
          stacked: true,
          id: 'bar-x-axis2',
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
          gridLines: {
            display: false,
          },
          id: 'bar-y-axis1',
          stacked: false,
          ticks: {
            display: false,
            beginAtZero: true,
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
            const item = data?.datasets[tooltipItem.datasetIndex]?.data[tooltipItem.index];
            const type = data?.datasets[tooltipItem.datasetIndex]?._meta[0]?.type;
            const label = data?.datasets[tooltipItem.datasetIndex]?.label;
            return { item, type, label };
          }
        },
      },
      custom(tooltipModel) {
        let tooltipEl = document.getElementById('chartjs-tooltip-fuel') as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-fuel';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_statistics_fuel"></div>';
          document.getElementById('chart-group-fuel-statistics').appendChild(tooltipEl);
        }

        // Hide if no tooltip
        if (tooltipModel.opacity === 0) {
          tooltipEl.style.opacity = '0';
          return;
        }

        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltipModel.yAlign) {
          tooltipEl.classList.add(tooltipModel.yAlign, 'custom-caret');
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
          if (tooltipModel.dataPoints[0].x > 60 && tooltipModel.dataPoints[0].x < 1350) {
            titleDirection = '';
          } else if (tooltipModel.dataPoints[0].x < 60) {
            titleDirection = 'right';
          } else {
            titleDirection = 'left';
          }
          bodyLines.forEach((body, i) => {
            let growItem = '';
            let theClass = '';
            switch (body[0].label) {
              case 'Gallons':
                growItem = 'Gallons';
                theClass = 'gallons';
                break;
              case 'Cost':
                growItem = 'Cost';
                theClass = 'cost';
                break;
              case 'Fuel':
                growItem = 'Fuel';
                theClass = 'fuel';
                break;
              case 'MPG':
                growItem = 'MPG';
                theClass = 'mpg';
                break;
              default:
                break;
            }
            innerHtml += `<p class="${theClass}">
                                      ${growItem}
                                  <span > $${body[0].item}.00</span>
                                  </p>`;
          });
          innerHtml += '</div>';
          innerHtml += `<p class="title ${titleDirection}">${title}</p>`;

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_statistics_fuel');
          tableRoot.innerHTML = innerHtml;
        }
        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltipModel.yAlign) {
          if (this.lengthBodyTooltip === 4) {
            tooltipEl.className = 'custom-caret';
          }
          if (this.lengthBodyTooltip === 3) {
            tooltipEl.className = 'custom-caret-three';
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
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '1';
        tooltipEl.style.left = tooltipModel.caretX + 'px';
        tooltipEl.style.top = '296px';
        tooltipEl.style.pointerEvents = 'none';
      },
    },
  };
  /* Data Line Chart */
  dataLine: any = {
    hover: {
      intersect: false,
    },
    labels: this.randomstring,
    datasets: [
      {
        data: this.randoms3,
        backgroundColor: '#A16CAFc6',
        borderColor: '#A16CAFc6',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#A16CAFc6',
        borderRadius: 0.9,
        borderWidth: 0,
        tension: 0.4,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
        order: 1,
      },
      {
        data: this.randoms2,
        backgroundColor: '#ffffff00',
        borderColor: '#ffffff00',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#ffffff00',
        borderRadius: 0.9,
        borderWidth: 0,
        tension: 0.4,
        categoryPercentage: 0.8,
        barPercentage: 0.5,
        order: 0,
      },
    ],
  };
  /* Options Line Chart */
  optionsLine: any = {
    responsive: true,
    plugins: false,
    hover: {},
    interaction: {
      intersect: false,
      mode: 'index',
    },
    layout: {
      padding: {
        right: 12,
      },
    },
    tooltips: {
      mode: 'index',
      intersect: false,
      enabled: false,
    },
    scales: {
      xAxes: [
        {
          offset: true,
          id: 'line-x-axis1',
          stacked: true,
          gridLines: {
            display: false,
            offsetGridLines: true,
          },
          ticks: {
            display: false,
          },
        },
        {
          stacked: true,
          id: 'line-x-axis2',
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
          beginAtZero: true,
          gridLines: {
            display: false,
          },
          id: 'line-y-axis1',
          stacked: false,
          ticks: {
            display: false,
            beginAtZero: true,
          },
        },
      ],
    },
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
  };

  /* Data Line 2 Chart */
  dataLine2: any = {
    type: 'line',
    hover: {
      intersect: false,
    },
    labels: this.randomstring,
    datasets: [
      {
        data: this.randoms3,
        backgroundColor: '#5673AAc6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#5673AAc6',
        barPercentage: 1,
        borderWidth: 0,
        fill: true,
        categoryPercentage: 0.7,
        tension: 0.4,
        order: 0,
      },
    ],
  };
  /* Options Line 2 Chart */
  optionsLine2: any = {
    responsive: true,
    hover: {},
    plugins: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    layout: {
      padding: {
        right: 12,
      },
    },
    tooltips: {
      mode: 'index',
      intersect: false,
      enabled: false,
    },
    scales: {
      xAxes: [
        {
          stacked: true,
          offset: true,
          display: true,
          title: {
            display: false,
          },
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          stacked: true,
          display: true,
          title: {
            display: true,
          },
          gridLines: {
            display: false,
          },
          ticks: {
            display: false,
          },
        },
      ],
    },
    maintainAspectRatio: false,
    legend: {
      display: false,
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
      stateName: 'statistic_drivers',
    },
    {
      title: 'Truck type',
      field: 'trucktype',
      data: [1, 2, 3, 4],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      gridNameTitle: 'Truck Types',
      stateName: 'statistic_trucks',
    },
    {
      title: 'State',
      field: 'state',
      data: [1, 2, 3, 4, 5, 6],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
      gridNameTitle: 'State',
      stateName: 'statistic_state',
    },
    {
      title: 'Trailer',
      field: 'trailer',
      data: [1, 2, 3],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 1 }, { id: 2 }, { id: 3 }],
      gridNameTitle: 'Trailers',
      stateName: 'statistic_trailers',
    },
    {
      title: 'Trailer Type',
      field: 'trailertype',
      data: [1, 2, 3, 4],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      gridNameTitle: 'Trailer Types',
      stateName: 'statistic_trailer_types',
    },
  ];

  /* Dummy Data for widgets */
  widgetsData = [
    { num: '14.63K', title: 'Gallons', active: true },
    { num: '$246K', title: 'Cost', active: true },
    { num: '$122.3', title: 'Avg. Fuel', active: true },
    { num: '752', title: 'MPG', active: true },
  ];
  /* Min Max Dummy data */
  minMaxData = [
    {
      dateLow: '04/07/19 - 04/15/19',
      dateHigh: '01/03/21 - 01/11/21',
      countLow: '324',
      countHigh: '542',
      title: 'Loaded Gallons',
    },
    {
      dateLow: '07/21/19 - 07/29/19',
      dateHigh: '10/06/20 - 10/14/20',
      countLow: '$2.53K',
      countHigh: '$5.32K',
      title: 'Fuel Cost',
    },
    {
      dateLow: '07/21/19 - 07/29/19',
      dateHigh: '10/06/20 - 10/14/20',
      countLow: '$213.2',
      countHigh: '$243.3',
      title: 'Average Fuel',
    },
    {
      dateLow: '12/30/19 - 01/06/20',
      dateHigh: '03/27/20 - 04/02/20',
      countLow: '43.3',
      countHigh: '65.3',
      title: 'Miles per Gallon',
    },
  ];
  hoveredIndex = -1;
  /* Normal and hover background color for doughnout charts */
  chartCollors: any = [
    {
      hovered: '#FFAD43',
      normal: '#FFAD4342',
      original: '#FFAD43c7',
    },
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
      hovered: '#A16CAF',
      normal: '#A16CAF42',
      original: '#A16CAFc7',
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
          '#FFAD43c7',
          '#FFAD43c7',
          '#FFAD43c7',
          '#FFAD43c7',
          '#FFAD43c7',
          '#FFAD43c7',
          '#FFAD43c7',
          '#FFAD43c7',
          '#FFAD43c7',
        ],
        borderWidth: 4,
      },
      {
        data: [3, 2, 6, 8, 9, 10, 2, 4, 6],
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
        data: [4, 1, 3, 7, 5, 6, 4, 9, 3],
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
          '#A16CAFc7',
          '#A16CAFc7',
          '#A16CAFc7',
          '#A16CAFc7',
          '#A16CAFc7',
          '#A16CAFc7',
          '#A16CAFc7',
          '#A16CAFc7',
          '#A16CAFc7',
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
        data: [23, 54, 56, 23, 94, 23, 54, 23, 56],
        backgroundColor: [
          '#FFAD43c7',
          '#FFAD43c7',
          '#FFAD43c7',
          '#FFAD43c7',
          '#FFAD43c7',
          '#FFAD43c7',
          '#FFAD43c7',
          '#FFAD43c7',
          '#FFAD43c7',
        ],
        borderWidth: 4,
      },
      {
        data: [3, 2, 6, 8, 9, 10, 2, 4, 6],
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
        data: [4, 1, 3, 7, 5, 6, 4, 9, 3],
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
          '#A16CAFc7',
          '#A16CAFc7',
          '#A16CAFc7',
          '#A16CAFc7',
          '#A16CAFc7',
          '#A16CAFc7',
          '#A16CAFc7',
          '#A16CAFc7',
          '#A16CAFc7',
        ],
        borderWidth: 4,
      },
    ],
  };
  /* Options for Doug Driver Chart */
  options: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 60,
    legend: false,
    plugins: false,
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
        let tooltipEl = document.getElementById('chartjs-tooltip-doughnut') as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-doughnut';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_drivers_fuel"></div>';
          document.getElementById('chart-doughnut-one-fuel-statistics').appendChild(tooltipEl);
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

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_drivers_fuel');
          tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '200';
        tooltipEl.style.left = '158px';
        tooltipEl.style.top = '100px';
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.transition = '0.3s all';
      },
    },
  };
  /* Options for Doug Broker Chart */
  optionsBroker: any = {
    responsive: true,
    maintainAspectRatio: false,
    cutoutPercentage: 60,
    plugins: false,
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
          'chartjs-tooltip-doughnut-broker'
        ) as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-doughnut-broker';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_drivers_fuel"></div>';
          document.getElementById('chart-doughnut-two-fuel-statistics').appendChild(tooltipEl);
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

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_drivers_fuel');
          tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font

        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '200';
        tooltipEl.style.left = '158px';
        tooltipEl.style.top = '100px';
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.transition = '0.3s all';
      },
    },
  };
  /* Chart Types to send to Parent for navigation */
  chartTypeData = [
    {
      id: 'mixed',
      name: 'Mixed',
      checked: true,
    },
    {
      id: 'bar',
      name: 'Bar',
      checked: false,
    },
    {
      id: 'line',
      name: 'Line',
      checked: false,
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
    for (const i of [0, 1, 2, 3]) {
      this.chartBar.chart.getDatasetMeta(i).hidden = false;
    }
    this.chartLine.chart.getDatasetMeta(0).hidden = false;
    this.chartLine.chart.getDatasetMeta(1).hidden = false;
    this.chartLine2.chart.getDatasetMeta(0).hidden = false;
    switch (type) {
      case 'Mixed':
        this.updateLineChart('line', true, false);
        this.updateBarChart('bar', true, false, false);
        break;
      case 'Bar':
        this.updateLineChart('bar', true, true);
        this.updateBarChart('bar', true, false, true);
        break;
      case 'Line':
        this.updateLineChart('line', false, false);
        this.updateBarChart('line', false, false, true);
        break;
      case 'Area':
        this.updateLineChart('line', true, false);
        this.updateBarChart('line', false, true, true);
        break;
      default:
        break;
    }
  }

  /* Method to update bottom line chart with new type */
  updateLineChart(type, style, mixed?) {
    this.chartLine.chart.config.type = type;
    if (mixed) {
      this.chartLine.chart.config.data.datasets[1].backgroundColor = '#5673AAc6';
      this.chartLine.chart.config.data.datasets[1].borderColor = '#5673AAc6';
      this.chartLine.chart.update();
    } else {
      this.chartLine.chart.config.data.datasets[1].backgroundColor = '#ffffff00';
      this.chartLine.chart.config.data.datasets[1].borderColor = '#ffffff00';
      if (!style) {
        this.chartLine2.chart.config.data.datasets[0].borderColor = '#5673AAc6';
        this.chartLine.chart.config.data.datasets[0].fill = style;
        this.chartLine.chart.config.data.datasets[0].borderWidth = 2;
        this.chartLine2.chart.config.data.datasets[0].fill = style;
        this.chartLine2.chart.config.data.datasets[0].borderWidth = 2;
      } else {
        this.chartLine2.chart.config.data.datasets[0].borderColor = '#ffffff00';
        this.chartLine.chart.config.data.datasets[0].fill = style;
        this.chartLine.chart.config.data.datasets[0].borderWidth = 0;
        this.chartLine2.chart.config.data.datasets[0].fill = style;
        this.chartLine2.chart.config.data.datasets[0].borderWidth = 0;
      }
      this.chartLine.options.animation = true;
      this.chartLine2.options.animation = true;
      this.chartLine.chart.update();
      this.chartLine2.chart.update();
    }
  }

  updateBarChart(type: string, style: boolean, fill?, show?) {
    this.chartBar.chart.config.type = type;
    if (!show) {
      this.chartBar.chart.config.data.datasets[2].backgroundColor = '#5673aac6';
      this.chartBar.chart.config.data.datasets[2].fill = false;
      this.chartBar.chart.config.data.datasets[2].type = 'line';
      this.chartBar.chart.config.data.datasets[2].borderColor = '#5673aac6';
      this.chartBar.chart.config.data.datasets[2].borderWidth = 2;
      this.chartBar.chart.config.data.datasets[2].pointBorderWidth = 2;
      this.chartBar.chart.config.data.datasets[2].pointRadius = 4;
      this.chartBar.chart.config.data.datasets[2].pointHoverRadius = 4;
      this.chartBar.chart.config.data.datasets[2].borderRadius = 0.5;
      this.chartBar.chart.config.data.datasets[2].pointBorderColor = '#5673aac6';
      this.chartBar.chart.config.data.datasets[2].pointBackgroundColor = '#ffffff';
      this.chartBar.chart.config.data.datasets[2].pointHoverBackgroundColor = '#5673aac6';
      this.chartBar.chart.config.data.datasets[2].pointHoverBorderColor = '#fff';
    } else {
      this.chartBar.chart.config.data.datasets[2].backgroundColor = '#ffffff00';
      this.chartBar.chart.config.data.datasets[2].fill = false;
      this.chartBar.chart.config.data.datasets[2].type = 'line';
      this.chartBar.chart.config.data.datasets[2].borderColor = '#ffffff00';
      this.chartBar.chart.config.data.datasets[2].borderWidth = 0;
      this.chartBar.chart.config.data.datasets[2].pointBorderColor = '#ffffff00';
      this.chartBar.chart.config.data.datasets[2].pointBorderWidth = 0;
      this.chartBar.chart.config.data.datasets[2].pointBackgroundColor = '#ffffff00';
      this.chartBar.chart.config.data.datasets[2].pointHoverBackgroundColor = '#ffffff00';
      this.chartBar.chart.config.data.datasets[2].pointHoverBorderColor = '#ffffff00';
    }
    if (!style) {
      if (fill) {
        this.chartBar.chart.config.data.datasets.forEach((element) => {
          element.fill = fill;
          element.borderWidth = 0;
        });
      } else {
        this.chartBar.chart.config.data.datasets.forEach((element) => {
          element.fill = false;
          element.borderWidth = 2;
        });
      }
    } else {
      this.chartBar.chart.config.data.datasets.forEach((element) => {
        element.fill = fill;
        element.borderWidth = 0;
      });
    }
    this.chartBar.options.animation = true;
    this.chartBar.chart.update();
  }

  ngAfterViewInit() {
    this.setDoughChartStyle();
  }

  /* Method for filter clearing */
  clearAllFilters() {
    console.log('Clear.');
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
    const otherElements1 = chart.chart.getDatasetMeta(0).data;
    const otherElements2 = chart.chart.getDatasetMeta(1).data;
    const otherElements3 = chart.chart.getDatasetMeta(2).data;
    const otherElements4 = chart.chart.getDatasetMeta(3).data;
    const allOtherElements = [];
    allOtherElements.push(otherElements1, otherElements2, otherElements3, otherElements4);
    allOtherElements.forEach((element, indexId) => {
      element.forEach((element2) => {
        element2._model.backgroundColor = this.chartCollors[indexId].normal;
      });
    });
    const activeElements = chart.chart.tooltip._active;
    const requestedElem1 = chart.chart.getDatasetMeta(0).data[dataId];
    const requestedElem2 = chart.chart.getDatasetMeta(1).data[dataId];
    const requestedElem3 = chart.chart.getDatasetMeta(2).data[dataId];
    const requestedElem4 = chart.chart.getDatasetMeta(3).data[dataId];
    activeElements.push(requestedElem1, requestedElem2, requestedElem3, requestedElem4);
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
        element._model.backgroundColor = this.chartCollors[indexId].normal;
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
        element._model.backgroundColor = this.chartCollors[indexId].normal;
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
  onClickShowHideDataset(i, active) {
    if (this.chartTypeData[0].checked === true) {
      if (i !== 3) {
        this.widgetsData[i].active = !active;
        this.chartBar.chart.getDatasetMeta(i).hidden = active;
        this.chartBar.chart.update();
      } else {
        this.widgetsData[i].active = !active;
        this.chartLine.chart.getDatasetMeta(0).hidden = active;
        this.chartLine.chart.update();
        this.chartBar.chart.getDatasetMeta(i).hidden = active;
        this.chartBar.chart.update();
      }
    } else if (this.chartTypeData[1].checked === true) {
      if (i !== 3 && i !== 2) {
        this.widgetsData[i].active = !active;
        this.chartBar.chart.getDatasetMeta(i).hidden = active;
        this.chartBar.chart.update();
      } else {
        const index = i === 3 ? 0 : 1;
        this.widgetsData[i].active = !active;
        this.chartLine.chart.getDatasetMeta(index).hidden = active;
        this.chartLine.chart.update();
        this.chartBar.chart.getDatasetMeta(i).hidden = active;
        this.chartBar.chart.update();
      }
    } else if (this.chartTypeData[2].checked === true || this.chartTypeData[3].checked === true) {
      if (i !== 3 && i !== 2) {
        this.widgetsData[i].active = !active;
        this.chartBar.chart.getDatasetMeta(i).hidden = active;
        this.chartBar.chart.update();
      } else if (i === 3) {
        this.widgetsData[i].active = !active;
        this.chartLine.chart.getDatasetMeta(0).hidden = active;
        this.chartLine.chart.update();
        this.chartBar.chart.getDatasetMeta(i).hidden = active;
        this.chartBar.chart.update();
      } else {
        this.widgetsData[i].active = !active;
        this.chartLine2.chart.getDatasetMeta(0).hidden = active;
        this.chartLine2.chart.update();
        this.chartBar.chart.getDatasetMeta(i).hidden = active;
        this.chartBar.chart.update();
      }
    }
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
