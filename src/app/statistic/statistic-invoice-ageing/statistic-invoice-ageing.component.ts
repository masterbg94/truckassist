import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableData } from 'src/app/shared/truckassist-table/models/truckassist-table';
import { StatisticService } from 'src/app/core/services/statistic.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-statistic-invoice-ageing',
  templateUrl: './statistic-invoice-ageing.component.html',
  styleUrls: ['./statistic-invoice-ageing.component.scss'],
  animations: [
    trigger('filter-in', [
      state(
        'smaller',
        style({
          height: '660px',
        })
      ),
      state(
        'larger',
        style({
          height: '364px',
        })
      ),
      transition('smaller => larger', animate('400ms ease-in-out')),
      transition('larger => smaller', animate('400ms 0.5s ease-in-out')),
    ]),
    trigger('filter-out', [
      state(
        'smaller',
        style({
          opacity: '0',
        })
      ),
      state(
        'larger',
        style({
          opacity: '1',
        })
      ),
      transition('smaller => larger', animate('400ms 0.5s ease-in-out')),
      transition('larger => smaller', animate('400ms ease-in-out')),
    ]),
  ],
})
export class StatisticInvoiceAgeingComponent implements OnInit, AfterViewInit, OnDestroy {
  /* Crop chart state */
  cropChart = false;
  /* Tooltips for doughnut charts */
  tooltipFinishedDriver = true;
  tooltipFinishedBroker = true;
  lengthBodyTooltip;
  /* Clear All Filter state */
  filterEnabled = false;
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
      total: '597',
      _0: '25.0K',
      _30: '1,356',
      _60: '1,356',
      _90: '1,356',
      average: '1,356',
      active: false,
    },
    {
      driverId: 1,
      name: 'Angelo Trotter',
      total: '457',
      _0: '24.2K',
      _30: '1.231',
      _60: '1.231',
      _90: '1.231',
      average: '1.231',
      active: false,
    },
    {
      driverId: 2,
      name: 'Jerry Smith',
      total: '324',
      _0: '24.2K',
      _30: '1.231',
      _60: '1.231',
      _90: '1.231',
      average: '1.231',
      active: false,
    },
    {
      driverId: 3,
      name: 'Beth White',
      total: '542',
      _0: '24.2K',
      _30: '1.231',
      _60: '1.231',
      _90: '1.231',
      average: '1.231',
      active: false,
    },
    {
      driverId: 4,
      name: 'Fraight Gustavo',
      total: '543',
      _0: '24.2K',
      _30: '1.231',
      _60: '1.231',
      _90: '1.231',
      average: '1.231',
      active: false,
    },
    {
      driverId: 5,
      name: 'Walter Hanks',
      total: '235',
      _0: '24.2K',
      _30: '1.231',
      _60: '1.231',
      _90: '1.231',
      average: '1.231',
      active: false,
    },
    {
      driverId: 6,
      name: 'Michael Scott',
      total: '523',
      _0: '24.2K',
      _30: '1.231',
      _60: '1.231',
      _90: '1.231',
      average: '1.231',
      active: false,
    },
    {
      driverId: 7,
      name: 'Jessie Pinkman',
      total: '324',
      _0: '24.2K',
      _30: '1.231',
      _60: '1.231',
      _90: '1.231',
      average: '1.231',
      active: false,
    },
    {
      driverId: 8,
      name: 'Dwight K. Schrute',
      total: '872',
      _0: '24.2K',
      _30: '1.231',
      _60: '1.231',
      _90: '1.231',
      average: '1.231',
      active: false,
    },
  ];
  /* Query params */
  params = {
    dateFrom: '',
    dateTo: '',
    type: '',
  };
  /* Charts  */
  @ViewChild('chartBar') chartBar: any;
  @ViewChild('chartLine') chartLine: any;
  @ViewChild('chartDoug') chartDoug: any;
  @ViewChild('chartDougBroker') chartDougBroker: any;
  /* Randomize Bar and Line Data */
  randoms1 = [...Array(37)].map(() => Math.floor(Math.random() * 9) + 1);
  randoms2 = [...Array(37)].map(() => Math.floor(Math.random() * 9));
  randoms3 = [...Array(37)].map(() => Math.floor(Math.random() * 9));
  randoms4 = [...Array(37)].map(() => Math.floor(Math.random() * 9));
  randomstring = [...Array(37)].map(() => 'Aug ' + Math.floor(Math.random() * 9) + 'th, 2019');
  randoms = [this.randoms1, this.randoms2, this.randoms3, this.randoms4];
  /* Data Bar Chart */
  dataBar: any = {
    hover: {
      intersect: false,
    },
    labels: this.randomstring,
    datasets: [
      {
        label: '0 - 30',
        data: this.randoms1,
        backgroundColor: '#24C1A1c6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#24C1A1c6',
        borderRadius: 2,
        barPercentage: 0.75,
        categoryPercentage: 0.9,
        order: 1,
      },
      {
        label: '30 - 60',
        data: this.randoms2,
        backgroundColor: '#5673AAc6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#5673AAc6',
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
        barPercentage: 0.75,
        categoryPercentage: 0.9,
        order: 2,
      },
      {
        label: '60 - 90',
        data: this.randoms2,
        backgroundColor: '#FFA24Ec6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#FFA24Ec6',
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
        barPercentage: 0.75,
        categoryPercentage: 0.9,
        order: 3,
      },
      {
        label: '90+',
        data: this.randoms2,
        backgroundColor: '#A16CAFc6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#A16CAFc6',
        borderWidth: 2,
        borderRadius: 5,
        borderSkipped: false,
        barPercentage: 0.75,
        categoryPercentage: 0.9,
        order: 4,
      },
      {
        label: 'Average',
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
        let tooltipEl = document.getElementById('chartjs-tooltip-invoice') as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-invoice';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_statistics_invoice"></div>';
          document.getElementById('chart-group-invoice-statistics').appendChild(tooltipEl);
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
          const total = 10;
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
          let isDays = true;
          bodyLines.forEach((body, i) => {
            let growItem = '';
            let theClass = '';
            switch (body[0].label) {
              case '0 - 30':
                growItem = '0 - 30';
                theClass = '_0-30';
                isDays = false;
                break;
              case '30 - 60':
                growItem = '30 - 60';
                theClass = '_30-60';
                isDays = false;
                break;
              case '60 - 90':
                growItem = '60 - 90';
                theClass = '_60-90';
                isDays = false;
                break;
              case '90+':
                growItem = '90+';
                theClass = '_90';
                isDays = false;
                break;
              case 'Average':
                growItem = 'Average';
                theClass = 'average';
                isDays = true;
                break;
              default:
                break;
            }
            if (isDays) {
              innerHtml += `<p class="${theClass}">
                                        ${growItem}
                                        <span class="value"> ${body[0].item} Days</span>
                                    </p>`;
            } else {
              innerHtml += `<p class="${theClass}">
                                        ${growItem}
                                        <span class="value"> ${body[0].item}</span>
                                    </p>`;
            }
          });
          innerHtml += `<p class="total">Total
          <span > ${total}0</span>
          </p>`;
          innerHtml += '</div>';
          innerHtml += `<p class="title ${titleDirection}">${title}</p>`;

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_statistics_invoice');
          tableRoot.innerHTML = innerHtml;
        }
        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltipModel.yAlign) {
          if (this.lengthBodyTooltip === 5) {
            tooltipEl.className = 'custom-caret';
          }
          if (this.lengthBodyTooltip === 4) {
            tooltipEl.className = 'custom-caret-four';
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
        if (tooltipModel.dataPoints[0].x > 1240) {
          tooltipEl.classList.add('switch-tooltip');
        } else {
          tooltipEl.classList.add('switch-tooltip');
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
        tooltipEl.style.bottom = '440px';
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
        backgroundColor: '#ff3838aa',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#FFBEBEc6',
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
    tooltips: {
      mode: 'index',
      intersect: false,
      enabled: false,
    },
    layout: {
      padding: {
        right: 12,
      },
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
      title: 'Shipper',
      field: 'shipper',
      data: [1, 2],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 'Shipper' }, { id: 'Dummy' }],
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

  /* Data for doughnut chart dropdown filter */
  selectedDoughnutChartType = 'broker';
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

  /* Dummy Data for widgets */
  widgetsData = [
    { i: 0, indexId: 5, num: '8.65K', per: '', title: 'Total', active: true },
    { i: 1, indexId: 0, num: '613', per: '4.5%', title: '0 - 30', active: true },
    { i: 2, indexId: 1, num: '3.67K', per: '45.5%', title: '30 - 60', active: true },
    { i: 3, indexId: 2, num: '3.20K', per: '25.5%', title: '60 - 90', active: true },
    { i: 4, indexId: 3, num: '2.56K', per: '26.4%', title: '90+', active: true },
    { i: 5, indexId: 4, num: '48 Days', per: '', title: 'Average', active: true },
  ];
  /* Min Max Dummy data */
  minMaxData = [
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '1,206',
      countHigh: '2,012',
      title: 'Total Invoice',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Dec 20',
      countLow: '832',
      countHigh: '1,212',
      title: '0 - 30 days',
    },
    {
      dateLow: 'Jun 19',
      dateHigh: 'Oct 20',
      countLow: '105',
      countHigh: '574',
      title: '30 - 60 days',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Mar 21',
      countLow: '420',
      countHigh: '783',
      title: '60 - 90 days',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Mar 21',
      countLow: '420',
      countHigh: '783',
      title: '90+ days',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Mar 21',
      countLow: '420',
      countHigh: '783',
      title: 'Average',
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
      hovered: '#FF5D5D',
      normal: '#FF5D5D42',
      original: '#FF5D5Dc7',
    },
  ];
  chartCollors2: any = [
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
    plugins: false,
    maintainAspectRatio: false,
    cutoutPercentage: 75,
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
          'chartjs-tooltip-invoice-doughnut-drivers'
        ) as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-invoice-doughnut-drivers';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_drivers_invoice"></div>';
          document.getElementById('chart-doughnut-one-invoice-statistics').appendChild(tooltipEl);
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

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_drivers_invoice');
          tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '200';
        tooltipEl.style.left = '155px';
        tooltipEl.style.top = '121px';
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
          'chartjs-tooltip-invoice-doughnut-brokers'
        ) as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-invoice-doughnut-brokers';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_drivers_invoice_two"></div>';
          document.getElementById('chart-doughnut-two-invoice-statistics').appendChild(tooltipEl);
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

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_drivers_invoice_two');
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
  /* Initial state of animation */
  state = 'smaller';

  private destroy$: Subject<void> = new Subject<void>();
  constructor(private service: StatisticService) {}

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

  /* Destroy Subs */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* Method for choosing what to do with charts after selection */
  getAndSetChartTypes(type) {
    this.clearWidgets();
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

  /* Method to update bottom line chart with new type & style */
  updateLineChart(type, styleType?) {
    this.chartLine.chart.config.type = type;
    if (!styleType) {
      this.chartLine.chart.config.data.datasets[0].fill = styleType;
      this.chartLine.chart.config.data.datasets[0].borderColor = '#FF5D5D6d';
      this.chartLine.chart.config.data.datasets[0].borderWidth = '2';
    } else {
      this.chartLine.chart.config.data.datasets[0].fill = styleType;
      this.chartLine.chart.config.data.datasets[0].borderColor = '#fff0';
      this.chartLine.chart.config.data.datasets[0].borderWidth = '0';
    }
    this.chartLine.chart.update();
    this.chartLine.options.animation = true;
  }

  /* Method to update top bar chart with new type & style */
  updateBarChart(type: string, styleType: boolean, fill?, crop?: boolean) {
    this.chartBar.chart.config.type = type;
    this.cropChart = crop;
    if (!styleType) {
      if (fill) {
        this.chartBar.chart.config.data.datasets.forEach((element, i) => {
          if (i !== 4) {
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
          element.fill = styleType;
        });
      }
    } else {
      this.chartBar.chart.config.data.datasets[0].fill = styleType;
      this.chartBar.chart.config.data.datasets[0].borderColor = '#ffffff00';
      this.chartBar.chart.config.data.datasets[0].borderWidth = '0';
      if (crop) {
        this.chartBar.chart.config.data.datasets[4].fill = false;
        this.chartBar.chart.config.data.datasets[4].type = 'line';
        this.chartBar.chart.config.data.datasets[4].backgroundColor = '#ffffff00';
        this.chartBar.chart.config.data.datasets[4].borderColor = '#ffffff00';
        this.chartBar.chart.config.data.datasets[4].borderWidth = 0;
        this.chartBar.chart.config.data.datasets[4].pointBorderColor = '#ffffff00';
        this.chartBar.chart.config.data.datasets[4].pointBorderWidth = 0;
        this.chartBar.chart.config.data.datasets[4].pointBackgroundColor = '#ffffff00';
        this.chartBar.chart.config.data.datasets[4].pointHoverBackgroundColor = '#ffffff00';
        this.chartBar.chart.config.data.datasets[4].pointHoverBorderColor = '#ffffff00';
      } else {
        this.chartBar.chart.config.data.datasets[4].fill = false;
        this.chartBar.chart.config.data.datasets[4].type = 'line';
        this.chartBar.chart.config.data.datasets[4].backgroundColor = '#FFBEBE';
        this.chartBar.chart.config.data.datasets[4].borderColor = '#FF5D5D';
        this.chartBar.chart.config.data.datasets[4].borderWidth = 2;
        this.chartBar.chart.config.data.datasets[4].pointBorderColor = '#FF5D5D';
        this.chartBar.chart.config.data.datasets[4].pointBorderWidth = 3;
        this.chartBar.chart.config.data.datasets[4].pointBackgroundColor = '#fff';
        this.chartBar.chart.config.data.datasets[4].pointHoverBackgroundColor = '#FF5D5D';
        this.chartBar.chart.config.data.datasets[4].pointHoverBorderColor = '#FF5D5D';
      }
    }
    this.chartBar.chart.update();
    this.chartBar.options.animation = true;
  }

  ngAfterViewInit() {
    this.setDoughChartStyle();
  }

  /* Clear Widgets */
  clearWidgets() {
    this.widgetsData.forEach((element) => {
      element.active = true;
    });
    for (const i of [0, 1, 2, 3, 4]) {
      this.chartBar.chart.getDatasetMeta(i).hidden = false;
    }
    this.chartLine.chart.getDatasetMeta(0).hidden = false;
  }

  /* Method for filtering and clearing */
  clearAllFilters() {
    this.clearWidgets();
    this.filterEnabled = false;
    this.tableData.forEach((element) => {
      element.tabFilters.forEach((element2) => {
        element2.approved = false;
        element2.selected = false;
      });
    });
    this.animateBack();
  }
  /* Apply top dropdown filters */
  applyFilters() {
    this.clearWidgets();
    this.filterEnabled = true;
    this.animateTo();
  }
  /* Animate element */
  animateTo() {
    this.state = 'larger';
  }
  /* Animate element */
  animateBack() {
    this.state = 'smaller';
  }

  /* Method for chart styles */
  setDoughChartStyle() {
    // console.log(this.chartDoug.chart);
  }

  /* Method for on click event - show tooltips doug chart */
  showDriverTooltip(dataId, i, chart, chart2) {
    const currentActive = dataId;
    this.driverList.forEach((element) => {
      element.active = false;
    });
    this.driverList[i].active = true;
    if (this.lastActiveDriverToolbar !== currentActive && this.lastActiveElement) {
      this.lastActiveElement.forEach((element, indexNumber) => {
        element._model.backgroundColor = this.chartCollors[indexNumber].normal;
      });
    }
    if (this.lastActiveBrokerToolbar !== currentActive && this.lastActiveElementBroker) {
      this.lastActiveElementBroker.forEach((element, indexNumber) => {
        element._model.backgroundColor = this.chartCollors2[indexNumber].normal;
      });
    }
    chart.chart.tooltip._active = [];
    chart2.chart.tooltip._active = [];
    chart.chart.tooltip.update(true);
    chart2.chart.tooltip.update(true);
    chart.chart.draw();
    chart2.chart.draw();
    if (chart.chart.tooltip._active === undefined) {
      chart.chart.tooltip._active = [];
    }
    if (chart2.chart.tooltip._active === undefined) {
      chart2.chart.tooltip._active = [];
    }
    const allOtherElements = [];
    const allOtherElementsTwo = [];
    allOtherElements.push(chart.chart.getDatasetMeta(0).data, chart.chart.getDatasetMeta(1).data);
    allOtherElementsTwo.push(
      chart2.chart.getDatasetMeta(0).data,
      chart2.chart.getDatasetMeta(1).data,
      chart2.chart.getDatasetMeta(2).data,
      chart2.chart.getDatasetMeta(3).data
    );
    allOtherElements.forEach((element, indexNumber) => {
      element.forEach((element2) => {
        element2._model.backgroundColor = this.chartCollors[indexNumber].normal;
      });
    });
    allOtherElementsTwo.forEach((element, indexNumber) => {
      element.forEach((element2) => {
        element2._model.backgroundColor = this.chartCollors2[indexNumber].normal;
      });
    });
    const activeElements = chart.chart.tooltip._active;
    const activeElements2 = chart2.chart.tooltip._active;
    activeElements2.push(
      chart2.chart.getDatasetMeta(0).data[dataId],
      chart2.chart.getDatasetMeta(1).data[dataId],
      chart2.chart.getDatasetMeta(2).data[dataId],
      chart2.chart.getDatasetMeta(3).data[dataId]
    );
    activeElements.push(
      chart.chart.getDatasetMeta(0).data[dataId],
      chart.chart.getDatasetMeta(1).data[dataId]
    );
    activeElements.forEach((element, indexNumber) => {
      element._model.backgroundColor = this.chartCollors[indexNumber].hovered;
    });
    activeElements2.forEach((element, indexNumber) => {
      element._model.backgroundColor = this.chartCollors2[indexNumber].hovered;
    });
    chart.chart.tooltip._active = activeElements;
    chart2.chart.tooltip._active = activeElements2;
    chart.chart.tooltip.update(true);
    chart2.chart.tooltip.update(true);
    chart.chart.draw();
    chart2.chart.draw();
    this.lastActiveElement = activeElements;
    this.lastActiveElementBroker = activeElements2;
    this.lastActiveDriverToolbar = dataId;
    this.lastActiveBrokerToolbar = dataId;
    this.allOtherElementsDriver = allOtherElements;
    this.allOtherElementsBroker = allOtherElementsTwo;
    this.tooltipFinishedDriver = false;
    this.tooltipFinishedBroker = false;
  }

  /* Method for removing tooltips and returning chart to original state */
  removeFilters(chart, chart2) {
    this.driverList.forEach((element) => {
      element.active = false;
    });
    this.lastActiveElement.forEach((element, i) => {
      element._model.backgroundColor = this.chartCollors[i].normal;
    });
    this.lastActiveElementBroker.forEach((element, i) => {
      element._model.backgroundColor = this.chartCollors2[i].normal;
    });
    this.allOtherElementsDriver.forEach((element, i) => {
      element.forEach((element2) => {
        element2._model.backgroundColor = this.chartCollors[i].original;
      });
    });
    this.allOtherElementsBroker.forEach((element, i) => {
      element.forEach((element2) => {
        element2._model.backgroundColor = this.chartCollors2[i].original;
      });
    });
    this.tooltipFinishedDriver = true;
    this.tooltipFinishedBroker = true;

    /* Draw Chart after update */
    chart.chart.tooltip._active = [];
    chart2.chart.tooltip._active = [];
    chart.chart.tooltip.update(true);
    chart2.chart.tooltip.update(true);
    chart.chart.draw();
    chart2.chart.draw();
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
      if (i !== 0 && i !== 5) {
        const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
        this.widgetsData[theElement[0].i].active = !active;
        this.chartBar.chart.getDatasetMeta(indexId).hidden = active;
        this.chartBar.chart.update();
      }
      if (i === 5) {
        const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
        this.widgetsData[theElement[0].i].active = !active;
        this.chartLine.chart.getDatasetMeta(0).hidden = active;
        this.chartLine.chart.update();
      }
    }
  }

  /* Filter Tab Switched */
  switchTab(event, tableData) {
    tableData.forEach((element) => {
      element.tabFilters.forEach((element2) => {
        if (element2.selected) {
          this.applyFilters();
        }
      });
    });
  }

  /* Filter Dates and switch datepicker views*/
  filterDoughnutChart(params) {
    this.params.dateFrom = params.dateFrom;
    this.params.dateTo = params.dateTo;
    this.params.type = this.selectedDoughnutChartType;
    console.log(this.params);
  }

  /* Method for switching tabs for doughnut chart types */
  changeDoughChartData(event) {
    switch (event) {
      case 'shipper':
        this.data.datasets[0].data = [...Array(4)].map(() => Math.floor(Math.random() * 9) + 1);
        this.data.datasets[1].data = [...Array(4)].map(() => Math.floor(Math.random() * 9) + 1);
        this.dataBroker.datasets[0].data = [...Array(4)].map(
          () => Math.floor(Math.random() * 9) + 1
        );
        this.dataBroker.datasets[1].data = [...Array(4)].map(
          () => Math.floor(Math.random() * 9) + 1
        );
        this.dataBroker.datasets[2].data = [...Array(4)].map(
          () => Math.floor(Math.random() * 9) + 1
        );
        this.dataBroker.datasets[3].data = [...Array(4)].map(
          () => Math.floor(Math.random() * 9) + 1
        );
        this.chartDoug.chart.update();
        this.chartDougBroker.chart.update();
        this.driverList = [
          {
            driverId: 0,
            name: 'Rick Sanchez',
            total: '597',
            _0: '25.0K',
            _30: '1,356',
            _60: '1,356',
            _90: '1,356',
            average: '1,356',
            active: false,
          },
          {
            driverId: 1,
            name: 'Angelo Trotter',
            total: '457',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
          {
            driverId: 2,
            name: 'Jerry Smith',
            total: '324',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
          {
            driverId: 3,
            name: 'Beth White',
            total: '542',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
        ];
        break;
      case 'broker':
        this.data.datasets[0].data = [...Array(9)].map(() => Math.floor(Math.random() * 9) + 1);
        this.data.datasets[1].data = [...Array(9)].map(() => Math.floor(Math.random() * 9) + 1);
        this.dataBroker.datasets[0].data = [...Array(9)].map(
          () => Math.floor(Math.random() * 9) + 1
        );
        this.dataBroker.datasets[1].data = [...Array(9)].map(
          () => Math.floor(Math.random() * 9) + 1
        );
        this.dataBroker.datasets[2].data = [...Array(9)].map(
          () => Math.floor(Math.random() * 9) + 1
        );
        this.dataBroker.datasets[3].data = [...Array(9)].map(
          () => Math.floor(Math.random() * 9) + 1
        );
        this.chartDoug.chart.update();
        this.chartDougBroker.chart.update();
        this.driverList = [
          {
            driverId: 0,
            name: 'Rick Sanchez',
            total: '597',
            _0: '25.0K',
            _30: '1,356',
            _60: '1,356',
            _90: '1,356',
            average: '1,356',
            active: false,
          },
          {
            driverId: 1,
            name: 'Angelo Trotter',
            total: '457',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
          {
            driverId: 2,
            name: 'Jerry Smith',
            total: '324',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
          {
            driverId: 3,
            name: 'Beth White',
            total: '542',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
          {
            driverId: 4,
            name: 'Fraight Gustavo',
            total: '543',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
          {
            driverId: 5,
            name: 'Walter Hanks',
            total: '235',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
          {
            driverId: 6,
            name: 'Michael Scott',
            total: '523',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
          {
            driverId: 7,
            name: 'Jessie Pinkman',
            total: '324',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
          {
            driverId: 8,
            name: 'Dwight K. Schrute',
            total: '872',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
        ];
        break;
      case 'state':
        this.data.datasets[0].data = [...Array(5)].map(() => Math.floor(Math.random() * 9) + 1);
        this.data.datasets[1].data = [...Array(5)].map(() => Math.floor(Math.random() * 9) + 1);
        this.dataBroker.datasets[0].data = [...Array(5)].map(
          () => Math.floor(Math.random() * 9) + 1
        );
        this.dataBroker.datasets[1].data = [...Array(5)].map(
          () => Math.floor(Math.random() * 9) + 1
        );
        this.dataBroker.datasets[2].data = [...Array(5)].map(
          () => Math.floor(Math.random() * 9) + 1
        );
        this.dataBroker.datasets[3].data = [...Array(5)].map(
          () => Math.floor(Math.random() * 9) + 1
        );
        this.chartDoug.chart.update();
        this.chartDougBroker.chart.update();
        this.driverList = [
          {
            driverId: 0,
            name: 'Texas',
            total: '543',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
          {
            driverId: 1,
            name: 'New York',
            total: '235',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
          {
            driverId: 2,
            name: 'Florida',
            total: '523',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
          {
            driverId: 3,
            name: 'Alabama',
            total: '324',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
          {
            driverId: 4,
            name: 'California',
            total: '872',
            _0: '24.2K',
            _30: '1.231',
            _60: '1.231',
            _90: '1.231',
            average: '1.231',
            active: false,
          },
        ];
        break;
      default:
        break;
    }
    this.filterDoughnutChart(this.params);
  }
}
