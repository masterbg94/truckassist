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
  selector: 'app-statistic-violation',
  templateUrl: './statistic-violation.component.html',
  styleUrls: ['./statistic-violation.component.scss'],
  providers: [DatePipe],
})
export class StatisticViolationComponent implements OnInit, AfterViewInit, OnDestroy {
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
      inspection: '14',
      no_violation: '3',
      violation: '3',
      oos: '3',
      citation: '$30',
      active: false,
    },
    {
      driverId: 1,
      name: 'Angelo Trotter',
      inspection: '14',
      no_violation: '12',
      violation: '8',
      oos: '8',
      citation: '$80',
      active: false,
    },
    {
      driverId: 2,
      name: 'Jerry Smith',
      inspection: '14',
      no_violation: '12',
      violation: '8',
      oos: '8',
      citation: '$80',
      active: false,
    },
    {
      driverId: 3,
      name: 'Beth White',
      inspection: '14',
      no_violation: '12',
      violation: '8',
      oos: '8',
      citation: '$80',
      active: false,
    },
    {
      driverId: 4,
      name: 'Fraight Gustavo',
      inspection: '14',
      no_violation: '12',
      violation: '8',
      oos: '8',
      citation: '$80',
      active: false,
    },
    {
      driverId: 5,
      name: 'Walter Hanks',
      inspection: '14',
      no_violation: '12',
      violation: '8',
      oos: '8',
      citation: '$80',
      active: false,
    },
    {
      driverId: 6,
      name: 'Michael Scott',
      inspection: '14',
      no_violation: '12',
      violation: '8',
      oos: '8',
      citation: '$80',
      active: false,
    },
    {
      driverId: 7,
      name: 'Jessie Pinkman',
      inspection: '14',
      no_violation: '12',
      violation: '8',
      oos: '8',
      citation: '$80',
      active: false,
    },
    {
      driverId: 8,
      name: 'Dwight K. Schrute',
      inspection: '14',
      no_violation: '12',
      violation: '8',
      oos: '8',
      citation: '$80',
      active: false,
    },
  ];
  /* Dummy Broker List for Doug Chart */
  brokerList = [
    {
      driverId: 0,
      name: 'Unsafe Driving',
      inspection: '14',
      no_violation: '5',
      violation: '3',
      oos: '3',
      citation: '$30',
      active: false,
    },
    {
      driverId: 1,
      name: 'Vehicle Maint',
      inspection: '14',
      no_violation: '12',
      violation: '8',
      oos: '8',
      citation: '$80',
      active: false,
    },
    {
      driverId: 2,
      name: 'HOS Compliance',
      inspection: '14',
      no_violation: '12',
      violation: '8',
      oos: '8',
      citation: '$80',
      active: false,
    },
    {
      driverId: 3,
      name: 'HazMat Compl',
      inspection: '14',
      no_violation: '12',
      violation: '8',
      oos: '8',
      citation: '$80',
      active: false,
    },
    {
      driverId: 4,
      name: 'Driver Fitness',
      inspection: '14',
      no_violation: '12',
      violation: '8',
      oos: '8',
      citation: '$80',
      active: false,
    },
    {
      driverId: 5,
      name: 'Cont. SAS & ALC',
      inspection: '14',
      no_violation: '14',
      violation: '0',
      oos: '0',
      citation: '$0',
      active: false,
    },
  ];

  /* Charts  */
  @ViewChild('chartBar') chartBar: any;
  @ViewChild('chartLine') chartLine: any;
  @ViewChild('chartDoug') chartDoug: any;
  @ViewChild('chartDougBroker') chartDougBroker: any;
  /* Randomize Bar and Line Data */
  randoms1 = [...Array(33)].map(() => {
    const item = {
      x: Math.floor(Math.random() * 10) + 5,
      y: Math.floor(Math.random() * 10) + 5,
    };
    return item;
  });
  randoms2 = [...Array(33)].map(() => {
    const item = {
      x: Math.floor(Math.random() * 4) + 1,
      y: Math.floor(Math.random() * 4) + 1,
    };
    return item;
  });
  randoms3 = [...Array(33)].map(() => {
    const item = {
      x: Math.floor(Math.random() * 2),
      y: Math.floor(Math.random() * 2),
    };
    return item;
  });
  randomstring = [...Array(33)].map(() => 'June ' + Math.floor(Math.random() * 9) + 'th, 2019');
  /* Data Bar Chart */
  dataBar: any = {
    hover: {
      intersect: false,
    },
    labels: this.randomstring,
    datasets: [
      {
        label: 'No Violation',
        data: this.randoms1,
        backgroundColor: '#24C1A1',
        borderColor: '#fff0',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff0',
        pointHoverBackgroundColor: '#fff0',
        barPercentage: 0.75,
        categoryPercentage: 0.9,
        order: 0,
      },
      {
        label: 'Violation',
        data: this.randoms2,
        backgroundColor: '#FFAD43',
        borderColor: '#fff0',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff0',
        barPercentage: 0.75,
        categoryPercentage: 0.9,
        order: 1,
      },
      {
        label: 'Out of Service',
        data: this.randoms3,
        backgroundColor: '#FF5D5D',
        borderColor: '#fff0',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff0',
        barPercentage: 0.75,
        categoryPercentage: 0.9,
        order: 2,
      },
      {
        label: 'Citation',
        data: this.randoms3,
        backgroundColor: '#fff0',
        borderColor: '#fff0',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff0',
        pointHoverBackgroundColor: '#fff0',
        barPercentage: 0.75,
        categoryPercentage: 0.9,
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
        let tooltipEl = document.getElementById('chartjs-tooltip-violation') as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-violation';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_statistics_violation"></div>';
          document.getElementById('chart-group-violation-statistics').appendChild(tooltipEl);
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
          const inspection = 10;
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
          innerHtml += `<p class="inspection">Inspection
          <span > ${inspection}</span>
          </p>`;
          bodyLines.forEach((body, i) => {
            let growItem = '';
            let theClass = '';
            switch (body[0].label) {
              case 'No Violation':
                growItem = 'No Violation';
                theClass = 'no_violation';
                break;
              case 'Violation':
                growItem = 'Violation';
                theClass = 'violation';
                break;
              case 'Out of Service':
                growItem = 'Out of Service';
                theClass = 'oos';
                break;
              case 'Citation':
                growItem = 'Citation';
                theClass = 'citation';
                break;
              default:
                break;
            }
            innerHtml += `<p class="${theClass}">
                                      ${growItem}
                                      <span class="value"> ${body[0].item.x}</span>
                                      <span class="per"> ${body[0].item.y}%</span>
                                  </p>`;
          });
          innerHtml += '</div>';
          innerHtml += `<p class="title ${titleDirection}">${title}</p>`;

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_statistics_violation');
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
    hover: {
      intersect: false,
    },
    labels: this.randomstring,
    datasets: [
      {
        label: 'Citation',
        data: this.randoms2,
        backgroundColor: '#5673AAaa',
        borderColor: 'rgba(255, 100, 100, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff0',
        pointHoverBackgroundColor: '#5673AA6d',
        borderRadius: 0.9,
        tension: 0.5,
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
      title: 'Violation type',
      field: 'violation_type',
      data: [1, 2, 3],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 1 }, { id: 2 }, { id: 3 }],
      showToolsDropDown: true,
      gridNameTitle: 'Violations',
      stateName: 'statistic_violation_type',
    },
    {
      title: 'Driver',
      field: 'driver',
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      extended: false,
      selectTab: true,
      tabFilters: [
        { id: 'Driver 1' },
        { id: 'Driver 2' },
        { id: 'Driver 3' },
        { id: 'Driver 4' },
        { id: 'Driver 5' },
        { id: 'Driver 6' },
        { id: 'Driver 7' },
        { id: 'Driver 8' },
        { id: 'Driver 9' },
        { id: 'Driver 10' },
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
      title: 'State',
      field: 'state',
      data: [1, 2, 3, 4],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      gridNameTitle: 'State',
      stateName: 'statistic_state',
    },
    {
      title: 'County',
      field: 'county',
      data: [1, 2, 3, 4],
      extended: false,
      selectTab: true,
      tabFilters: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
      gridNameTitle: 'County',
      stateName: 'statistic_county',
    },
  ];

  /* Dummy Data for widgets */
  widgetsData = [
    { i: 0, indexId: 11, num: '454', per: '<12.23>', title: 'Insp', active: true },
    { i: 1, indexId: 0, num: '236', per: '84.5%', title: 'No Viol.', active: true },
    { i: 2, indexId: 1, num: '72', per: '15.5%', title: 'Violation', active: true },
    { i: 3, indexId: 2, num: '13', per: '3.5%', title: 'OOS', active: true },
    { i: 4, indexId: 3, num: '$12.3K', per: '1.5%', title: 'Citation', active: true },
  ];
  /* Min Max Dummy data */
  minMaxData = [
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '16',
      countHigh: '31',
      title: 'Inspection',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '12',
      countHigh: '20',
      title: 'Violation',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '4',
      countHigh: '10',
      title: 'Violation',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '6',
      countHigh: '10',
      title: 'Out of Service',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '3',
      countHigh: '10',
      title: 'Citation',
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
      hovered: '#24C1A1',
      normal: '#24C1A142',
      original: '#24C1A1c7',
    },
    {
      hovered: '#FFAD43',
      normal: '#FFAD4342',
      original: '#FFAD43c7',
    },
    {
      hovered: '#FF5D5D',
      normal: '#FF5D5D42',
      original: '#FF5D5Dc7',
    },
    {
      hovered: '#5673AA',
      normal: '#5673AA42',
      original: '#5673AAc7',
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
    ],
  };
  /* Doug Chart Broker */
  dataBroker: any = {
    labels: [],
    datasets: [
      {
        data: [23, 54, 56, 23, 94, 23],
        backgroundColor: [
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
        data: [3, 2, 6, 8, 9, 10],
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
      {
        data: [4, 1, 3, 7, 5, 6],
        backgroundColor: [
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
        data: [4, 1, 3, 7, 5, 6],
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
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
          '#5673AAc7',
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
        let tooltipEl = document.getElementById(
          'chartjs-tooltip-violation-doughnut'
        ) as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-violation-doughnut';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_drivers_violation"></div>';
          document.getElementById('chart-doughnut-one-violation-statistics').appendChild(tooltipEl);
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

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_drivers_violation');
          tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '200';
        tooltipEl.style.left = '150px';
        tooltipEl.style.top = '89px';
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
          'chartjs-tooltip-doughnut-broker-violation'
        ) as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-doughnut-broker-violation';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_drivers_violation"></div>';
          document.getElementById('chart-doughnut-two-violation-statistics').appendChild(tooltipEl);
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

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_drivers_violation');
          tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font

        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '200';
        tooltipEl.style.left = '150px';
        tooltipEl.style.top = '89px';
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
  selectedDoughnutChartType = 'driver';
  selectedDoughnutChartTypeTwo = 'violation_type';
  doughnutChartDataTypes: any = [
    {
      id: 1,
      name: 'Driver',
      value: 'driver',
    },
    {
      id: 2,
      name: 'Violation Type',
      value: 'violation_type',
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
    switch (type) {
      case 'Mixed':
        this.updateLineChart('line', true);
        this.updateBarChart('bar', true);
        break;
      case 'Bar':
        this.updateLineChart('bar', true);
        this.updateBarChart('bar', true);
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
    this.chartLine.chart.config.data.datasets[0].fill = style;
    this.chartLine.chart.config.data.datasets[0].borderColor = '#fff0';
    this.chartLine.chart.config.data.datasets[0].borderWidth = '0';
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
      }
    } else {
      this.chartBar.chart.config.data.datasets[0].fill = style;
      this.chartBar.chart.config.data.datasets[0].borderColor = '#fff0';
      this.chartBar.chart.config.data.datasets[0].borderWidth = '0';
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
      chart.chart.getDatasetMeta(3).data,
      chart.chart.getDatasetMeta(4).data
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
      chart.chart.getDatasetMeta(3).data[dataId],
      chart.chart.getDatasetMeta(4).data[dataId]
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
  onClickShowHideDataset(indexId, active) {
    if (indexId !== 11 && indexId !== 3) {
      const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
      this.widgetsData[theElement[0].i].active = !active;
      this.chartBar.chart.getDatasetMeta(indexId).hidden = active;
      this.chartBar.chart.update();
    } else if (indexId === 3) {
      const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
      this.widgetsData[theElement[0].i].active = !active;
      this.chartBar.chart.getDatasetMeta(indexId).hidden = active;
      this.chartBar.chart.update();
      this.chartLine.chart.getDatasetMeta(0).hidden = active;
      this.chartLine.chart.update();
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
