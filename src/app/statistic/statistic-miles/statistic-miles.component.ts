import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableData } from 'src/app/shared/truckassist-table/models/truckassist-table';
import { DatePipe } from '@angular/common';
import { StatisticService } from 'src/app/core/services/statistic.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-statistic-miles',
  templateUrl: './statistic-miles.component.html',
  styleUrls: ['./statistic-miles.component.scss'],
  providers: [DatePipe],
})
export class StatisticMilesComponent implements OnInit, AfterViewInit, OnDestroy {
  charts = [];
  customHtml;
  cropChart = false;
  loaded = false;
  tooltipFinishedDriver = true;
  tooltipFinishedBroker = true;
  lengthBodyTooltip;
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
      name: 'Rick Sanchez',
      miles: '597',
      loaded: '25.0K',
      empty: '1,356',
      stops: '1,356',
      active: false,
    },
    {
      driverId: 1,
      name: 'Angelo Trotter',
      miles: '457',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
    {
      driverId: 2,
      name: 'Jerry Smith',
      miles: '324',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
    {
      driverId: 3,
      name: 'Beth White',
      miles: '542',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
    {
      driverId: 4,
      name: 'Fraight Gustavo',
      miles: '543',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
    {
      driverId: 5,
      name: 'Walter Hanks',
      miles: '235',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
    {
      driverId: 6,
      name: 'Michael Scott',
      miles: '523',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
    {
      driverId: 7,
      name: 'Jessie Pinkman',
      miles: '324',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
    {
      driverId: 8,
      name: 'Dwight K. Schrute',
      miles: '872',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
  ];
  /* Dummy State List for Doug Chart */
  brokerList = [
    {
      driverId: 0,
      name: 'Indiana',
      miles: '4',
      loaded: '25.0K',
      empty: '1,356',
      stops: '1,356',
      active: false,
    },
    {
      driverId: 1,
      name: 'Pennsylvania',
      miles: '4',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
    {
      driverId: 2,
      name: 'Tennessee',
      miles: '3',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
    {
      driverId: 3,
      name: 'Massachusetts',
      miles: '2',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
    {
      driverId: 4,
      name: 'West Virginia',
      miles: '1',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
    {
      driverId: 5,
      name: 'Connecticut',
      miles: '1',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
    {
      driverId: 6,
      name: 'North Carolina',
      miles: '1',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
    {
      driverId: 7,
      name: 'Texas',
      miles: '1',
      loaded: '24.2K',
      empty: '1.231',
      stops: '1.231',
      active: false,
    },
    {
      driverId: 8,
      name: 'Florida',
      miles: '0',
      loaded: '0',
      empty: '0',
      stops: '0',
      active: false,
    },
  ];

  /* Charts  */
  @ViewChild('chartBar') chartBar: any;
  @ViewChild('chartLine') chartLine: any;
  @ViewChild('chartDoug') chartDoug: any;
  @ViewChild('chartDougBroker') chartDougBroker: any;
  /* Randomize Bar and Line Data */
  randoms1 = [...Array(40)].map(() => Math.floor(Math.random() * 9) + 1);
  randoms2 = [...Array(40)].map(() => Math.floor(Math.random() * 9));
  randoms3 = [...Array(40)].map(() => Math.floor(Math.random() * 9));
  randomstring = [...Array(40)].map(() => 'Aug ' + Math.floor(Math.random() * 9) + 'th, 2019');
  randoms = [this.randoms1, this.randoms2, this.randoms3];
  /* Data Bar Chart */
  dataBar: any = {
    hover: {
      intersect: false,
    },
    labels: this.randomstring,
    datasets: [
      {
        label: 'Loaded',
        data: this.randoms1,
        backgroundColor: '#344566c6',
        borderColor: '#5673AA',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#5673AA',
        borderRadius: 2,
        barPercentage: 0.75,
        categoryPercentage: 0.9,
        order: 1,
      },
      {
        label: 'Empty',
        data: this.randoms2,
        backgroundColor: '#5673AAc6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#5673AA',
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
        barPercentage: 0.75,
        categoryPercentage: 0.9,
        order: 2,
      },
      {
        label: 'Stops',
        data: this.randoms3,
        backgroundColor: '#FFBEBE',
        borderColor: '#FF5D5D',
        pointBorderColor: '#FF5D5D',
        pointBackgroundColor: '#fff',
        pointHoverBorderColor: '#FF5D5D',
        pointHoverBackgroundColor: '#FF5D5D',
        pointBorderWidth: 3,
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 4,
        borderRadius: 0.5,
        barPercentage: 0.9,
        categoryPercentage: 0.9,
        order: 0,
        type: 'line',
        fill: false,
      },
    ],
  };
  /* Options Bar Chart */
  optionsBar: any = {
    plugins: false,
    responsive: true,
    hover: {},
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
    layout: {
      padding: {
        right: 12,
      },
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
        let tooltipEl = document.getElementById('chartjs-tooltip-miles') as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-miles';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_statistics_miles"></div>';
          document.getElementById('chart-group-miles-statistics').appendChild(tooltipEl);
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
          const miles = 0;
          const bodyLines = tooltipModel.body.map(getBody);
          let innerHtml = '<div style="display: -webkit-box; -webkit-box-orient: vertical;">';
          this.lengthBodyTooltip = bodyLines.length;
          // miles = +bodyLines[0] + +bodyLines[1];
          let titleDirection = '';
          if (tooltipModel.dataPoints[0].x > 40 && tooltipModel.dataPoints[0].x < 1350) {
            titleDirection = '';
          } else if (tooltipModel.dataPoints[0].x < 40) {
            titleDirection = 'right';
          } else {
            titleDirection = 'left';
          }
          let perBool = true;
          bodyLines.forEach((body, i) => {
            let growItem = '';
            let theClass = '';
            switch (body[0].label) {
              case 'Loaded':
                growItem = 'Loaded';
                theClass = 'loaded';
                perBool = true;
                break;
              case 'Empty':
                growItem = 'Empty';
                theClass = 'empty';
                perBool = true;
                break;
              case 'Stops':
                growItem = 'Stops';
                theClass = 'stops';
                perBool = false;
                break;
              default:
                break;
            }
            if (perBool) {
              innerHtml += `<p class="${theClass}">
                                        ${growItem}
                                        <span class="value"> $${body[0].item},000</span>
                                        <span class="per"> 25%</span>
                                    </p>`;
            } else {
              innerHtml += `<p class="${theClass}">
                                        ${growItem}
                                        <span class="value"> $${body[0].item},000</span>
                                    </p>`;
            }
          });
          innerHtml += `<p class="miles">Miles
                        <span > ${miles}00</span>
                        </p>`;
          innerHtml += '</div>';
          innerHtml += `<p class="title ${titleDirection}">${title}</p>`;

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_statistics_miles');
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
        tooltipEl.style.width = tooltipModel.body[0].lines[0].width + 'px';
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
    type: 'bar',
    hover: {
      intersect: false,
    },
    labels: this.randomstring,
    datasets: [
      {
        data: this.randoms1,
        backgroundColor: '#FF5D5D6d',
        borderColor: 'rgba(255, 100, 100, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#5673AA',
        barPercentage: 0.75,
        categoryPercentage: 0.9,
        tension: 0.4,
        order: 1,
      },
    ],
  };
  /* Options Line Chart */
  optionsLine: any = {
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
      title: 'Trailer',
      field: 'trailer',
      data: [1, 2, 3],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 1 }, { id: 2 }, { id: 3 }],
      gridNameTitle: 'Types',
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
    { i: 0, indexId: 3, num: '24,636', per: '', title: 'Miles', active: true },
    { i: 1, indexId: 0, num: '46,302', per: '74.5%', title: 'Loaded', active: true },
    { i: 2, indexId: 1, num: '6,352', per: '25.5%', title: 'Empty', active: true },
    { i: 3, indexId: 2, num: '18,352', per: '', title: 'Stops', active: true },
  ];
  /* Min Max Dummy data */
  minMaxData = [
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '1,206',
      countHigh: '2,012',
      title: 'Total Miles',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Dec 20',
      countLow: '832',
      countHigh: '1,212',
      title: 'Loaded Miles',
    },
    {
      dateLow: 'Jun 19',
      dateHigh: 'Oct 20',
      countLow: '105',
      countHigh: '574',
      title: 'Empty Miles',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Mar 21',
      countLow: '420',
      countHigh: '783',
      title: 'Stops',
    },
  ];
  hoveredIndex = -1;
  /* Normal and hover background color for doughnout charts */
  chartCollors: any = [
    {
      hovered: '#6C6C6C',
      normal: '#6C6C6C42',
      original: '#6C6C6Cc7',
    },
    {
      hovered: '#344566',
      normal: '#34456642',
      original: '#344566c7',
    },
    {
      hovered: '#5673AA',
      normal: '#5673AA42',
      original: '#5673AAc7',
    },
    {
      hovered: '#FF5D5D',
      normal: '#FF5D5D42',
      original: '#FF5D5Dc7',
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
      {
        data: [3, 2, 6, 8, 9, 10, 2, 4, 6],
        backgroundColor: [
          '#344566c7',
          '#344566c7',
          '#344566c7',
          '#344566c7',
          '#344566c7',
          '#344566c7',
          '#344566c7',
          '#344566c7',
          '#344566c7',
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
        data: [3, 2, 3, 6, 5, 6, 4, 8, 2],
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
    ],
  };
  /* Doug Chart Broker */
  dataBroker: any = {
    labels: [],
    datasets: [
      {
        data: [3, 2, 6, 8, 9, 10, 2, 4, 6],
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
      {
        data: [23, 54, 56, 23, 94, 23, 54, 23, 56],
        backgroundColor: [
          '#344566c7',
          '#344566c7',
          '#344566c7',
          '#344566c7',
          '#344566c7',
          '#344566c7',
          '#344566c7',
          '#344566c7',
          '#344566c7',
        ],
        borderWidth: 4,
      },
      {
        data: [3, 2, 3, 6, 5, 6, 4, 8, 2],
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
          'chartjs-tooltip-miles-doughnut-drivers'
        ) as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-miles-doughnut-drivers';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_drivers_miles"></div>';
          document.getElementById('chart-doughnut-one-miles-statistics').appendChild(tooltipEl);
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

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_drivers_miles');
          tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '200';
        tooltipEl.style.left = '155px';
        tooltipEl.style.top = '101px';
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.transition = '0.3s all';
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
          'chartjs-tooltip-miles-doughnut-drokers'
        ) as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-miles-doughnut-drokers';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_drivers_miles"></div>';
          document.getElementById('chart-doughnut-two-miles-statistics').appendChild(tooltipEl);
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

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_drivers_miles');
          tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font

        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '200';
        tooltipEl.style.left = '155px';
        tooltipEl.style.top = '101px';
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
    this.chartLine.chart.getDatasetMeta(0).hidden = false;
    switch (type) {
      case 'Mixed':
        this.updateLineChart('bar', true);
        this.updateBarChart('bar', true, false, false);
        break;
      case 'Bar':
        this.updateLineChart('bar', true);
        this.updateBarChart('bar', true, false, true);
        break;
      case 'Area':
        this.updateLineChart('line', true);
        this.updateBarChart('line', false, true, true);
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
      this.chartLine.chart.config.data.datasets[0].borderColor = '#FF5D5D6d';
      this.chartLine.chart.config.data.datasets[0].borderWidth = '2';
    } else {
      this.chartLine.chart.config.data.datasets[0].fill = style;
      this.chartLine.chart.config.data.datasets[0].borderColor = '#fff0';
      this.chartLine.chart.config.data.datasets[0].borderWidth = '0';
    }
    this.chartLine.chart.update();
    this.chartLine.options.animation = true;
  }

  updateBarChart(type: string, style: boolean, fill?, crop?: boolean) {
    this.chartBar.chart.config.type = type;
    this.cropChart = crop;
    if (!style) {
      if (fill) {
        this.chartBar.chart.config.data.datasets.forEach((element, i) => {
          if (i === 1 || i === 0) {
            element.fill = fill;
            element.borderColor = '#ffffff00';
          } else {
            element.borderColor = '#ffffff00';
            element.borderWidth = '#ffffff00';
            element.pointBorderColor = '#ffffff00';
            element.pointBorderWidth = '#ffffff00';
            element.pointBackgroundColor = '#ffffff00';
            element.pointHoverBackgroundColor = '#ffffff00';
            element.pointHoverBorderColor = '#ffffff00';
          }
        });
      } else {
        this.chartBar.chart.config.data.datasets.forEach((element) => {
          element.fill = style;
        });
      }
    } else {
      this.chartBar.chart.config.data.datasets[0].fill = style;
      this.chartBar.chart.config.data.datasets[0].borderColor = '#ffffff00';
      this.chartBar.chart.config.data.datasets[0].borderWidth = '0';
      if (crop) {
        this.chartBar.chart.config.data.datasets[2].fill = false;
        this.chartBar.chart.config.data.datasets[2].type = 'line';
        this.chartBar.chart.config.data.datasets[2].backgroundColor = '#ffffff00';
        this.chartBar.chart.config.data.datasets[2].borderColor = '#ffffff00';
        this.chartBar.chart.config.data.datasets[2].borderWidth = 0;
        this.chartBar.chart.config.data.datasets[2].pointBorderColor = '#ffffff00';
        this.chartBar.chart.config.data.datasets[2].pointBorderWidth = 0;
        this.chartBar.chart.config.data.datasets[2].pointBackgroundColor = '#ffffff00';
        this.chartBar.chart.config.data.datasets[2].pointHoverBackgroundColor = '#ffffff00';
        this.chartBar.chart.config.data.datasets[2].pointHoverBorderColor = '#ffffff00';
      } else {
        this.chartBar.chart.config.data.datasets[2].fill = false;
        this.chartBar.chart.config.data.datasets[2].type = 'line';
        this.chartBar.chart.config.data.datasets[2].backgroundColor = '#FFBEBE';
        this.chartBar.chart.config.data.datasets[2].borderColor = '#FF5D5D';
        this.chartBar.chart.config.data.datasets[2].borderWidth = 2;
        this.chartBar.chart.config.data.datasets[2].pointBorderColor = '#FF5D5D';
        this.chartBar.chart.config.data.datasets[2].pointBorderWidth = 3;
        this.chartBar.chart.config.data.datasets[2].pointBackgroundColor = '#fff';
        this.chartBar.chart.config.data.datasets[2].pointHoverBackgroundColor = '#FF5D5D';
        this.chartBar.chart.config.data.datasets[2].pointHoverBorderColor = '#FF5D5D';
      }
    }
    this.chartBar.chart.update();
    this.chartBar.options.animation = true;
  }

  ngAfterViewInit() {
    this.setDoughChartStyle();
  }

  /* Method for filter clearing */
  clearAllFilters() {
    console.log('Clear.');
    console.log(this.chartDougBroker);
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
      this.lastActiveElement.forEach((element, i) => {
        element._model.backgroundColor = this.chartCollors[i].normal;
      });
      this.allOtherElementsDriver.forEach((element, i) => {
        element.forEach((element2) => {
          element2._model.backgroundColor = this.chartCollors[i].original;
        });
      });
      this.tooltipFinishedDriver = true;
    }
    if (chart === this.chartDougBroker) {
      this.brokerList.forEach((element) => {
        element.active = false;
      });
      this.lastActiveElementBroker.forEach((element, i) => {
        element._model.backgroundColor = this.chartCollors[i].normal;
      });
      this.allOtherElementsBroker.forEach((element, i) => {
        element.forEach((element2) => {
          element2._model.backgroundColor = this.chartCollors[i].original;
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
  onClickShowHideDataset(i, indexId, active) {
    if (this.chartTypeData[0].checked === true) {
      if (i > 0) {
        const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
        this.widgetsData[theElement[0].i].active = !active;
        this.chartBar.chart.getDatasetMeta(indexId).hidden = active;
        this.chartBar.chart.update();
      }
    } else {
      if (i !== 0 || i !== 3) {
        const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
        this.widgetsData[theElement[0].i].active = !active;
        this.chartBar.chart.getDatasetMeta(indexId).hidden = active;
        this.chartBar.chart.update();
      }
      if (i === 3) {
        const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
        this.widgetsData[theElement[0].i].active = !active;
        this.chartLine.chart.getDatasetMeta(0).hidden = active;
        this.chartLine.chart.update();
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
