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
  selector: 'app-statistic-load',
  templateUrl: './statistic-load.component.html',
  styleUrls: ['./statistic-load.component.scss'],
  providers: [DatePipe],
})
export class StatisticLoadComponent implements OnInit, AfterViewInit, OnDestroy {
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
      name: 'Rick Sanchez',
      count: '597',
      revenue: '$25.0K',
      average: '$1,356',
      active: false,
    },
    {
      driverId: 1,
      name: 'Angelo Trotter',
      count: '457',
      revenue: '$24.2K',
      average: '$1.231',
      active: false,
    },
    {
      driverId: 2,
      name: 'Jerry Smith',
      count: '324',
      revenue: '$24.2K',
      average: '$1.231',
      active: false,
    },
    {
      driverId: 3,
      name: 'Beth White',
      count: '542',
      revenue: '$24.2K',
      average: '$1.231',
      active: false,
    },
    {
      driverId: 4,
      name: 'Fraight Gustavo',
      count: '543',
      revenue: '$24.2K',
      average: '$1.231',
      active: false,
    },
    {
      driverId: 5,
      name: 'Walter Hanks',
      count: '235',
      revenue: '$24.2K',
      average: '$1.231',
      active: false,
    },
    {
      driverId: 6,
      name: 'Michael Scott',
      count: '523',
      revenue: '$24.2K',
      average: '$1.231',
      active: false,
    },
    {
      driverId: 7,
      name: 'Jessie Pinkman',
      count: '324',
      revenue: '$24.2K',
      average: '$1.231',
      active: false,
    },
    {
      driverId: 8,
      name: 'Dwight K. Schrute',
      count: '872',
      revenue: '$24.2K',
      average: '$1.231',
      active: false,
    },
  ];
  /* Dummy Broker List for Doug Chart */
  brokerList = [
    {
      driverId: 0,
      name: 'Rick Sanchez',
      count: '4',
      revenue: '$25.0K',
      average: '$1,356',
      active: false,
    },
    {
      driverId: 1,
      name: 'Angelo Trotter',
      count: '4',
      revenue: '$24.2K',
      average: '$1.231',
      active: false,
    },
    {
      driverId: 2,
      name: 'Jerry Smith',
      count: '3',
      revenue: '$24.2K',
      average: '$1.231',
      active: false,
    },
    {
      driverId: 3,
      name: 'Beth White',
      count: '2',
      revenue: '$24.2K',
      average: '$1.231',
      active: false,
    },
    {
      driverId: 4,
      name: 'Fraight Gustavo',
      count: '1',
      revenue: '$24.2K',
      average: '$1.231',
      active: false,
    },
    {
      driverId: 5,
      name: 'Walter Hanks',
      count: '0',
      revenue: '$0',
      average: '$0',
      active: false,
    },
  ];

  /* Charts  */
  @ViewChild('chartBar') chartBar: any;
  @ViewChild('chartLine') chartLine: any;
  @ViewChild('chartDoug') chartDoug: any;
  @ViewChild('chartDougBroker') chartDougBroker: any;
  /* Randomize Bar and Line Data */
  randoms1 = [...Array(306)].map(() => Math.floor(Math.random() * 9) + 1);
  randoms2 = [...Array(306)].map(() => Math.floor(Math.random() * 9));
  randoms3 = [...Array(306)].map(() => Math.floor(Math.random() * 9));
  randomstring = [...Array(306)].map(() => 'June ' + Math.floor(Math.random() * 9) + 'th, 2019');
  randoms = [this.randoms1, this.randoms2, this.randoms3];
  /* Data Bar Chart */
  dataBar: any = {
    hover: {
      intersect: false,
    },
    labels: this.randomstring,
    datasets: [
      {
        data: this.randoms1,
        backgroundColor: '#BBC7DD',
        borderColor: '#5673AA',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#5673AA',
        borderRadius: 0.9,
        barPercentage: 0.9,
        categoryPercentage: 0.9,
      },
      {
        data: this.randoms2,
        backgroundColor: '#D69DAA',
        borderColor: '#24C1A1',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#5673AA',
        borderRadius: 0.9,
        barPercentage: 0.9,
        categoryPercentage: 0.9,
      },
      {
        data: this.randoms3,
        backgroundColor: '#FFBEBE',
        borderColor: '#24C1A1',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#5673AA',
        borderRadius: 0.9,
        barPercentage: 0.9,
        categoryPercentage: 0.9,
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
      custom(tooltipModel) {
        let tooltipEl = document.getElementById('chartjs-tooltip-load') as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-load';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_statistics"></div>';
          document.getElementById('chart-group-load-statistics').appendChild(tooltipEl);
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
          let innerHtml = '<div>';
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
            switch (i) {
              case 0:
                growItem = 'Count';
                theClass = 'count';
                break;
              case 1:
                growItem = 'Revenue';
                theClass = 'revenue';
                break;
              case 2:
                growItem = 'Avg.';
                theClass = 'avg';
                break;
              default:
                break;
            }
            innerHtml += `<p class="${theClass}">
                                      ${growItem}
                                  <span > $${body}.00</span>
                                  </p>`;
          });
          innerHtml += '</div>';
          innerHtml += `<p class="title ${titleDirection}">${title}</p>`;

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_statistics');
          tableRoot.innerHTML = innerHtml;
        }
        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltipModel.yAlign) {
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
        data: this.randoms1,
        backgroundColor: '#24C1A16d',
        borderColor: 'rgba(255, 100, 100, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#5673AA',
        borderRadius: 0.9,
        tension: 0.4,
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
    {
      title: 'Shipper',
      field: 'shipper',
      data: [1, 2],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 1 }, { id: 2 }],
      gridNameTitle: 'Shippers',
      stateName: 'statistic_shippers',
    },
    {
      title: 'Broker',
      field: 'broker',
      data: [1, 2, 3, 4, 5, 6],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
      gridNameTitle: 'Brokers',
      stateName: 'statistic_brokers',
    },
    {
      title: 'Dispatcher',
      field: 'dispatcher',
      data: [1, 2, 3, 4, 5, 6, 7],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }, { id: 7 }],
      gridNameTitle: 'Dispatcher',
      stateName: 'statistic_dispatcher',
    },
    {
      title: 'Pickup State',
      field: 'pickup',
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
      gridNameTitle: 'Pickup State',
      stateName: 'statistic_pickup_state',
    },
    {
      title: 'Delivery State',
      field: 'delivery',
      data: [1, 2, 3, 4, 5, 6],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }, { id: 6 }],
      gridNameTitle: 'Delivery State State',
      stateName: 'statistic_delivery_state',
    },
  ];

  /* Dummy Data for widgets */
  widgetsData = [
    { num: '4,636', title: 'Count', active: true },
    { num: '$246K', title: 'Revenue', active: true },
    { num: '$2,352', title: 'Average', active: true },
  ];
  /* Min Max Dummy data */
  minMaxData = [
    { dateLow: '07/03/19', dateHigh: '10/04/20', countLow: '3', countHigh: '12', title: 'Count' },
    {
      dateLow: '09/04/19',
      dateHigh: '05/08/20',
      countLow: '$3,768',
      countHigh: '$14.2K',
      title: 'Revenue',
    },
    {
      dateLow: '04/17/19',
      dateHigh: '12/28/19',
      countLow: '$763',
      countHigh: '$1,698',
      title: 'Average',
    },
  ];
  hoveredIndex = -1;
  /* Normal and hover background color for doughnout charts */
  chartCollors: any = [
    {
      hovered: '#5673AA',
      normal: '#5673aa42',
      original: '#5673AAc7',
    },
    {
      hovered: '#FF5D5D',
      normal: '#FF5D5D42',
      original: '#FF5D5Dc7',
    },
    {
      hovered: '#24C1A1',
      normal: '#24C1A142',
      original: '#24C1A1c7',
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
          '#5673aac7',
          '#5673aac7',
          '#5673aac7',
          '#5673aac7',
          '#5673aac7',
          '#5673aac7',
          '#5673aac7',
          '#5673aac7',
          '#5673aac7',
        ],
        borderWidth: 4,
      },
      {
        data: [3, 2, 6, 8, 9, 10, 2, 4, 6],
        backgroundColor: [
          '#FF5D5Dc7',
          '#FF5D5Dc7',
          '#FF5D5Dc7',
          '#FF5D5Dc7',
          '#FF5D5Dc7',
          '#FF5D5Dc7',
          '#FF5D5Dc7',
          '#FF5D5Dc7',
          '#FF5D5Dc7',
        ],
        borderWidth: 4,
      },
      {
        data: [4, 1, 3, 7, 5, 6, 4, 9, 3],
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
    ],
  };
  /* Doug Chart Broker */
  dataBroker: any = {
    labels: [],
    datasets: [
      {
        data: [23, 54, 56, 23, 94, 23],
        backgroundColor: [
          '#5673aac7',
          '#5673aac7',
          '#5673aac7',
          '#5673aac7',
          '#5673aac7',
          '#5673aac7',
        ],
        borderWidth: 4,
      },
      {
        data: [3, 2, 6, 8, 9, 10],
        backgroundColor: [
          '#FF5D5Dc7',
          '#FF5D5Dc7',
          '#FF5D5Dc7',
          '#FF5D5Dc7',
          '#FF5D5Dc7',
          '#FF5D5Dc7',
        ],
        borderWidth: 4,
      },
      {
        data: [4, 1, 3, 7, 5, 6],
        backgroundColor: [
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
          '#24C1A1c7',
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
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_drivers"></div>';
          document.getElementById('chart-doughnut-one-load-statistics').appendChild(tooltipEl);
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

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_drivers');
          tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '200';
        tooltipEl.style.left = '158px';
        tooltipEl.style.top = '111px';
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
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_drivers"></div>';
          document.getElementById('chart-doughnut-two-load-statistics').appendChild(tooltipEl);
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

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_drivers');
          tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font

        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '200';
        tooltipEl.style.left = '158px';
        tooltipEl.style.top = '111px';
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
    for (const i of [0, 1, 2]) {
      this.chartBar.chart.getDatasetMeta(i).hidden = false;
    }
    switch (type) {
      case 'Mixed':
        this.updateLineChart('line', true);
        this.updateBarChart('bar', true);
        break;
      case 'Bar':
        this.updateLineChart('bar', true);
        this.updateBarChart('bar', true);
        break;
      case 'Line':
        this.updateLineChart('line', false);
        this.updateBarChart('line', false);
        break;
      case 'Area':
        this.updateLineChart('line', true);
        this.updateBarChart('line', false, true);
        break;
      default:
        break;
    }
  }

  /* Method to update bottom line chart with new type */
  updateLineChart(type, style?) {
    this.chartLine.chart.config.type = type;
    if (!style) {
      this.chartLine.chart.config.data.datasets[0].fill = style;
      this.chartLine.chart.config.data.datasets[0].borderColor = '#24C1A16d';
      this.chartLine.chart.config.data.datasets[0].borderWidth = '2';
    } else {
      this.chartLine.chart.config.data.datasets[0].fill = style;
      this.chartLine.chart.config.data.datasets[0].borderColor = '#fff0';
      this.chartLine.chart.config.data.datasets[0].borderWidth = '0';
    }
    this.chartLine.chart.update();
    this.chartLine.options.animation = true;
  }

  updateBarChart(type: string, style: boolean, fill?) {
    this.chartBar.chart.config.type = type;
    if (!style) {
      if (fill) {
        this.chartBar.chart.config.data.datasets.forEach((element) => {
          element.fill = fill;
          element.borderColor = '#fff0';
        });
      } else {
        this.chartBar.chart.config.data.datasets.forEach((element) => {
          element.fill = style;
        });
        this.chartBar.chart.config.data.datasets[0].borderColor = '#5673AA6d';
        this.chartBar.chart.config.data.datasets[1].borderColor = '#FF5D5D6d';
        this.chartBar.chart.config.data.datasets[2].borderColor = '#24C1A16d';
      }
    } else {
      this.chartBar.chart.config.data.datasets[0].fill = style;
      this.chartBar.chart.config.data.datasets[0].borderColor = '#fff0';
      this.chartBar.chart.config.data.datasets[0].borderWidth = '0';
    }
    this.chartBar.chart.update();
    this.chartLine.options.animation = true;
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
    const allOtherElements = [];
    allOtherElements.push(otherElements1, otherElements2, otherElements3);
    allOtherElements.forEach((element, indexId) => {
      element.forEach((element2) => {
        element2._model.backgroundColor = this.chartCollors[indexId].normal;
      });
    });
    const activeElements = chart.chart.tooltip._active;
    const requestedElem1 = chart.chart.getDatasetMeta(0).data[dataId];
    const requestedElem2 = chart.chart.getDatasetMeta(1).data[dataId];
    const requestedElem3 = chart.chart.getDatasetMeta(2).data[dataId];
    activeElements.push(requestedElem1, requestedElem2, requestedElem3);
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
