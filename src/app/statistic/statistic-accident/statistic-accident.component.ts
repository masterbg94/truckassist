import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableData } from 'src/app/shared/truckassist-table/models/truckassist-table';
import { DatePipe } from '@angular/common';
import { StatisticService } from 'src/app/core/services/statistic.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-statistic-accident',
  templateUrl: './statistic-accident.component.html',
  styleUrls: ['./statistic-accident.component.scss'],
  providers: [DatePipe],
})
export class StatisticAccidentComponent implements OnInit, AfterViewInit, OnDestroy {
  charts = [];
  customHtml;
  loaded = false;
  tooltipFinishedDriver = true;
  tooltipFinishedMiles = true;
  lengthBodyTooltip;
  /* Query params */
  params = {
    dateFrom: '',
    dateTo: '',
    type: '',
  };
  /* Last Active Tooltip  */
  lastActiveDriverToolbar;
  lastActiveMilesToolbar;
  /* Last Active Chart Element */
  lastActiveElement;
  lastActiveElementMiles;
  allOtherElementsDriver;
  allOtherElementsMiles;
  /* Dummy Driver List for Doug Chart */
  driverList = [
    {
      driverId: 0,
      name: 'Rick Sanchez',
      accident: '10',
      reportable: '9',
      non_reportable: '4',
      injury: '5',
      fatality: '3',
      hazmat: '2',
      towing: '7',
      active: false,
    },
    {
      driverId: 1,
      name: 'Angelo Trotter',
      accident: '10',
      reportable: '9',
      non_reportable: '4',
      injury: '5',
      fatality: '3',
      hazmat: '2',
      towing: '7',
      active: false,
    },
    {
      driverId: 2,
      name: 'Jerry Smith',
      accident: '10',
      reportable: '9',
      non_reportable: '4',
      injury: '5',
      fatality: '3',
      hazmat: '2',
      towing: '7',
      active: false,
    },
    {
      driverId: 3,
      name: 'Beth White',
      accident: '10',
      reportable: '9',
      non_reportable: '4',
      injury: '5',
      fatality: '3',
      hazmat: '2',
      towing: '7',
      active: false,
    },
    {
      driverId: 4,
      name: 'Fraight Gustavo',
      accident: '10',
      reportable: '9',
      non_reportable: '4',
      injury: '5',
      fatality: '3',
      hazmat: '2',
      towing: '7',
      active: false,
    },
    {
      driverId: 5,
      name: 'Walter Hanks',
      accident: '10',
      reportable: '9',
      non_reportable: '4',
      injury: '5',
      fatality: '3',
      hazmat: '2',
      towing: '7',
      active: false,
    },
    {
      driverId: 6,
      name: 'Michael Scott',
      accident: '10',
      reportable: '9',
      non_reportable: '4',
      injury: '5',
      fatality: '3',
      hazmat: '2',
      towing: '7',
      active: false,
    },
    {
      driverId: 7,
      name: 'Jessie Pinkman',
      accident: '10',
      reportable: '9',
      non_reportable: '4',
      injury: '5',
      fatality: '3',
      hazmat: '2',
      towing: '7',
      active: false,
    },
    {
      driverId: 8,
      name: 'Dwight K. Schrute',
      accident: '10',
      reportable: '9',
      non_reportable: '4',
      injury: '5',
      fatality: '3',
      hazmat: '2',
      towing: '7',
      active: false,
    },
  ];

  /* Charts  */
  @ViewChild('chartBar') chartBar: any;
  @ViewChild('chartLine') chartLine: any;
  @ViewChild('chartDoug') chartDoug: any;
  @ViewChild('chartDoug2') chartDoug2: any;
  /* Randomize Bar and Line Data */
  randomsPlus = [...Array(22)].map(() => {
    const item = {
      x: Math.floor(Math.random() * 36) + 3,
      y: Math.floor(Math.random() * 36) + 3,
    };
    return item;
  });
  randomsPlus2 = [...Array(22)].map(() => {
    const item = {
      x: Math.floor(Math.random() * 10) + 5,
      y: Math.floor(Math.random() * 10) + 5,
    };
    return item;
  });
  randomsPlus3 = [...Array(22)].map(() => {
    const item = {
      x: Math.floor(Math.random() * 10) + 1,
      y: Math.floor(Math.random() * 10) + 1,
    };
    return item;
  });
  randomsMinus = [...Array(22)].map(() => {
    const item = {
      x: Math.floor(Math.random() * 5) - 10,
      y: Math.floor(Math.random() * 5) - 10,
    };
    return item;
  });
  randomsMinus2 = [...Array(22)].map(() => {
    const item = {
      x: Math.floor(Math.random() * 3) - 10,
      y: Math.floor(Math.random() * 3) - 10,
    };
    return item;
  });
  randomstring = [...Array(22)].map(() => 'Nov ' + Math.floor(Math.random() * 9) + 'th, 2020');
  /* Data Bar Chart */
  dataBar: any = {
    hover: {
      intersect: false,
    },
    labels: this.randomstring,
    datasets: [
      {
        label: 'Reportable',
        data: this.randomsPlus,
        backgroundColor: '#5673AAc6',
        borderColor: '#fff0',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#5673AA',
        barPercentage: 1,
        borderRadius: 150,
        borderSkipped: false,
        categoryPercentage: 0.65,
        order: 0,
        stack: '0',
      },
      {
        label: 'Non-Report.',
        data: this.randomsPlus2,
        backgroundColor: '#344566c6',
        borderWidth: 2,
        borderRadius: 150,
        borderSkipped: false,
        borderColor: '#fff0',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#344566',
        barPercentage: 1,
        categoryPercentage: 0.65,
        order: 1,
        stack: '0',
      },
      {
        label: 'Injury',
        data: this.randomsPlus2,
        backgroundColor: '#FFAD43c6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#FFAD43',
        borderRadius: 150,
        borderSkipped: false,
        barPercentage: 1,
        categoryPercentage: 0.65,
        order: 2,
        stack: '1',
      },
      {
        label: 'Fatality',
        data: this.randomsPlus3,
        backgroundColor: '#FF5D5Dc6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#FF5D5D',
        borderRadius: 150,
        borderSkipped: false,
        barPercentage: 1,
        categoryPercentage: 0.65,
        order: 3,
        stack: '1',
      },
      {
        label: 'Hazmat',
        data: this.randomsPlus3,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: 'rgba(0, 0, 0, 0)',
        borderRadius: 150,
        borderSkipped: false,
        barPercentage: 1,
        categoryPercentage: 0.65,
        order: 4,
        stack: '0',
      },
      {
        label: 'Towing',
        data: this.randomsPlus3,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: 'rgba(0, 0, 0, 0)',
        borderRadius: 150,
        borderSkipped: false,
        barPercentage: 1,
        categoryPercentage: 0.65,
        order: 5,
        stack: '1',
      },
    ],
  };
  /* Options Bar Chart */
  optionsBar: any = {
    plugins: false,
    borderRadius: 150,
    borderSkipped: false,
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
          borderRadius: 150,
          borderSkipped: false,
          beginAtZero: true,
          offset: true,
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
          borderRadius: 150,
          borderSkipped: false,
          beginAtZero: true,
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
        let tooltipEl = document.getElementById('chartjs-tooltip-accident') as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-accident';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_statistics_accident"></div>';
          document.getElementById('chart-group-accident-statistics').appendChild(tooltipEl);
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
          const accident = 10;
          const bodyLines = tooltipModel.body.map(getBody);
          let innerHtml = '<div style="display: -webkit-box; -webkit-box-orient: vertical;">';
          this.lengthBodyTooltip = bodyLines.length;
          let titleDirection = '';
          if (tooltipModel.dataPoints[0].x > 40 && tooltipModel.dataPoints[0].x < 1150) {
            titleDirection = '';
          } else if (tooltipModel.dataPoints[0].x < 40) {
            titleDirection = 'right';
          } else {
            titleDirection = 'left';
          }
          innerHtml += `<p class="accident">Accident
                        <span > ${accident}</span>
                        </p>`;
          bodyLines.forEach((body, i) => {
            let growItem = '';
            let theClass = '';
            switch (body[0].label) {
              case 'Reportable':
                growItem = 'Reportable';
                theClass = 'reportable';
                break;
              case 'Non-Report.':
                growItem = 'Non-Report.';
                theClass = 'non_report';
                break;
              case 'Injury':
                growItem = 'Injury';
                theClass = 'injury';
                break;
              case 'Fatality':
                growItem = 'Fatality';
                theClass = 'fatality';
                break;
              case 'Hazmat':
                growItem = 'Hazmat';
                theClass = 'hazmat';
                break;
              case 'Towing':
                growItem = 'Towing';
                theClass = 'towing';
                break;
              default:
                break;
            }
            if (body[0].item.x < 0 || body[0].item.y < 0) {
              innerHtml += `<p class="${theClass}">
                              ${growItem}
                              <span class="value"> ${body[0].item.x * -1}</span>
                              <span class="per"> ${body[0].item.y * -1}%</span>
                            </p>`;
            } else {
              innerHtml += `<p class="${theClass}">
              ${growItem}
              <span class="value"> ${body[0].item.x}</span>
              <span class="per"> ${body[0].item.y}%</span>
              </p>`;
            }
          });

          innerHtml += '</div>';
          innerHtml += `<p class="title ${titleDirection}">${title}</p>`;

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_statistics_accident');
          tableRoot.innerHTML = innerHtml;
        }
        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltipModel.yAlign) {
          tooltipEl.className = 'custom-caret';
          if (this.lengthBodyTooltip === 5) {
            tooltipEl.className = 'custom-caret-five';
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
        if (tooltipModel.dataPoints[0].x > 930) {
          tooltipEl.classList.add('switch-tooltip');
        } else {
          tooltipEl.classList.remove('switch-tooltip');
        }
        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font
        tooltipEl.style.width =
          tooltipModel.body[0].lines[0].width + tooltipModel.body[0].lines[0].width + 'px';
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '1';
        tooltipEl.style.left = tooltipModel.caretX + 'px';
        tooltipEl.style.top = '223px';
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
        data: this.randomsPlus2,
        backgroundColor: '#24C1A1c6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#24C1A1',
        barPercentage: 1,
        categoryPercentage: 0.65,
        tension: 0.5,
        order: 0,
        stack: '0',
      },
      {
        data: this.randomsMinus,
        backgroundColor: '#A16CAFc6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#A16CAF',
        barPercentage: 1,
        categoryPercentage: 0.65,
        tension: 0.5,
        order: 1,
        stack: '1',
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
          position: 'left',
          offset: true,
          display: true,
          beginAtZero: true,
          title: {
            display: false,
          },
          gridLines: {
            display: true,
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
  public selectedTab = '';
  public selectedTabDriver = '';
  /* Filter Dummy Data */
  tableData: TableData[] = [
    {
      title: 'Driver',
      field: 'driver',
      data: [1, 2, 3, 4, 5, 6, 7, 8, 9],
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
    { i: 0, indexId: 11, num: '67', per: '<7.23>', title: 'Accident', active: true },
    { i: 1, indexId: 0, num: '49', per: '74.5%', title: 'Reportable', active: true },
    { i: 2, indexId: 1, num: '18', per: '25.5%', title: 'Non-Rep.', active: true },
    { i: 3, indexId: 2, num: '19', per: '13.4%', title: 'Injury', active: true },
    { i: 4, indexId: 3, num: '5', per: '13.5%', title: 'Fatality', active: true },
    { i: 5, indexId: 4, num: '24', per: '21.2%', title: 'Hazmat', active: true },
    { i: 6, indexId: 5, num: '42', per: '72.4%', title: 'Towing', active: true },
  ];
  /* Min Max Dummy data */
  minMaxData = [
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '16',
      countHigh: '3',
      title: 'Accident',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '12',
      countHigh: '0',
      title: 'Reportable',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '4',
      countHigh: '0',
      title: 'Non-Reportable',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '6',
      countHigh: '0',
      title: 'Injury',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '3',
      countHigh: '0',
      title: 'Fatality',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '8',
      countHigh: '0',
      title: 'Hazmat',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Dec 20',
      countLow: '16',
      countHigh: '0',
      title: 'Towing',
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
      hovered: '#5673AA',
      normal: '#5673AA42',
      original: '#5673AAc7',
    },
    {
      hovered: '#344566',
      normal: '#34456642',
      original: '#344566c7',
    },
  ];
  chartCollors2: any = [
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
      hovered: '#24C1A1',
      normal: '#24C1A142',
      original: '#24C1A1c7',
    },
    {
      hovered: '#A16CAF',
      normal: '#A16CAF42',
      original: '#A16CAFc7',
    },
  ];
  /* Doug Chart Driver */
  type = 'doughnut';
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
          'chartjs-tooltip-accident-doughnut-drivers'
        ) as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-accident-doughnut-drivers';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_drivers_accident"></div>';
          document.getElementById('chart-doughnut-one-accident-statistics').appendChild(tooltipEl);
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

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_drivers_accident');
          tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '200';
        tooltipEl.style.left = '170px';
        tooltipEl.style.top = '110px';
        tooltipEl.style.pointerEvents = 'none';
        tooltipEl.style.transition = '0.3s all';
      },
    },
  };

  /* Doug Chart Miles */
  type2 = 'doughnut';
  data2: any = {
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
  options2: any = {
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
          'chartjs-tooltip-accident-doughnut-miles'
        ) as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-accident-doughnut-miles';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_miles_accident"></div>';
          // document.body.appendChild(tooltipEl);
          document.getElementById('chart-doughnut-two-accident-statistics').appendChild(tooltipEl);
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

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_miles_accident');
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
    for (const i of [0, 1, 2, 3, 4, 5]) {
      this.chartBar.chart.getDatasetMeta(i).hidden = false;
    }
    this.chartLine.chart.getDatasetMeta(0).hidden = false;
    this.chartLine.chart.getDatasetMeta(1).hidden = false;
    switch (type) {
      case 'Mixed':
        this.updateLineChart('line', true);
        this.updateBarChart('bar', true);
        break;
      case 'Bar':
        this.updateLineChart('bar', false);
        this.updateBarChart('bar', true);
        break;
      case 'Area':
        this.updateLineChart('line', true);
        this.updateBarChart('line', false);
        break;
      default:
        break;
    }
  }

  /* Method to update bottom line chart with new type */
  updateLineChart(type, style?) {
    this.chartLine.chart.config.type = type;
    if (!style) {
      this.chartLine.data.datasets.forEach((dataset, i) => {
        if (i === 1) {
          const dataE = dataset.data;
          dataE.forEach((element) => {
            const x = Math.abs(element.x);
            const y = Math.abs(element.y);
            element.x = x;
            element.y = y;
            return element;
          });
        }
      });
    } else {
      this.chartLine.data.datasets.forEach((dataset, i) => {
        if (i === 1) {
          const dataE = dataset.data;
          dataE.forEach((element) => {
            if (element.x > 0 || element.y > 0) {
              const x = element.x * -1;
              const y = element.y * -1;
              element.x = x;
              element.y = y;
              return element;
            }
          });
        }
      });
      this.chartLine.chart.config.data.datasets[0].fill = style;
      this.chartLine.chart.config.data.datasets[0].borderColor = '#fff0';
      this.chartLine.chart.config.data.datasets[0].borderWidth = '0';
    }
    this.chartLine.chart.update();
    this.chartLine.options.animation = true;
  }

  updateBarChart(type: string, style: boolean) {
    this.chartBar.chart.config.type = type;
    if (!style) {
      this.chartBar.data.datasets[2].data = this.randomsMinus;
      this.chartBar.data.datasets[3].data = this.randomsMinus;
      this.chartBar.chart.config.data.datasets.forEach((element) => {
        element.fill = true;
      });
    } else {
      this.chartBar.data.datasets[2].data = this.randomsPlus2;
      this.chartBar.data.datasets[3].data = this.randomsPlus3;
      this.chartBar.chart.config.data.datasets[0].fill = style;
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
  showDriverTooltip(dataId, i, chart, chart2) {
    const currentActive = dataId;
    this.driverList.forEach((element) => {
      element.active = false;
    });
    this.driverList[i].active = true;
    if (this.lastActiveDriverToolbar !== currentActive && this.lastActiveElement) {
      this.lastActiveElement.forEach((element, index) => {
        element._model.backgroundColor = this.chartCollors[index].normal;
      });
    }
    if (this.lastActiveMilesToolbar !== currentActive && this.lastActiveElementMiles) {
      this.lastActiveElementMiles.forEach((element, index) => {
        element._model.backgroundColor = this.chartCollors2[index].normal;
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
    const allOtherElementsMiles = [];
    allOtherElementsMiles.push(
      chart2.chart.getDatasetMeta(0).data,
      chart2.chart.getDatasetMeta(1).data,
      chart2.chart.getDatasetMeta(2).data,
      chart2.chart.getDatasetMeta(3).data
    );
    allOtherElements.push(
      chart.chart.getDatasetMeta(0).data,
      chart.chart.getDatasetMeta(1).data,
      chart.chart.getDatasetMeta(2).data
    );
    allOtherElements.forEach((element, index) => {
      element.forEach((element2) => {
        element2._model.backgroundColor = this.chartCollors[index].normal;
      });
    });
    allOtherElementsMiles.forEach((element, index) => {
      element.forEach((element2) => {
        element2._model.backgroundColor = this.chartCollors2[index].normal;
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
      chart.chart.getDatasetMeta(1).data[dataId],
      chart.chart.getDatasetMeta(2).data[dataId]
    );
    activeElements.forEach((element, index) => {
      element._model.backgroundColor = this.chartCollors[index].hovered;
    });
    activeElements2.forEach((element, index) => {
      element._model.backgroundColor = this.chartCollors2[index].hovered;
    });
    chart.chart.tooltip._active = activeElements;
    chart2.chart.tooltip._active = activeElements2;
    chart.chart.tooltip.update(true);
    chart2.chart.tooltip.update(true);
    chart.chart.draw();
    chart2.chart.draw();
    this.lastActiveElement = activeElements;
    this.lastActiveElementMiles = activeElements2;
    this.lastActiveDriverToolbar = dataId;
    this.lastActiveMilesToolbar = dataId;
    this.allOtherElementsDriver = allOtherElements;
    this.allOtherElementsMiles = allOtherElementsMiles;
    this.tooltipFinishedDriver = false;
    this.tooltipFinishedMiles = false;
  }

  /* Method for removing tooltips and returning chart to original state */
  removeFilters(chart, chart2) {
    this.driverList.forEach((element) => {
      element.active = false;
    });
    this.lastActiveElement.forEach((element, index) => {
      element._model.backgroundColor = this.chartCollors[index].normal;
    });
    this.lastActiveElementMiles.forEach((element, index) => {
      element._model.backgroundColor = this.chartCollors2[index].normal;
    });
    this.allOtherElementsDriver.forEach((element, index) => {
      element.forEach((element2) => {
        element2._model.backgroundColor = this.chartCollors[index].original;
      });
    });
    this.allOtherElementsMiles.forEach((element, index) => {
      element.forEach((element2) => {
        element2._model.backgroundColor = this.chartCollors2[index].original;
      });
    });
    this.tooltipFinishedDriver = true;
    this.tooltipFinishedMiles = true;

    /* Draw Chart after update */
    chart.chart.tooltip._active = [];
    chart2.chart.tooltip._active = [];
    chart.chart.tooltip.update(true);
    chart2.chart.tooltip.update(true);
    chart.chart.draw();
    chart2.chart.draw();
  }

  /* Method for Bar Chart - Show or Hide a specific dataset with widgets */
  onClickShowHideDataset(indexId, active) {
    if (indexId !== 11 && indexId !== 4 && indexId !== 5) {
      const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
      this.widgetsData[theElement[0].i].active = !active;
      this.chartBar.chart.getDatasetMeta(indexId).hidden = active;
      this.chartBar.chart.update();
    } else if (indexId === 4 || indexId === 5) {
      const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
      this.widgetsData[theElement[0].i].active = !active;
      this.chartBar.chart.getDatasetMeta(indexId).hidden = active;
      this.chartBar.chart.update();
      this.chartLine.chart.getDatasetMeta(indexId - 4).hidden = active;
      this.chartLine.chart.update();
    }
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
        break;
      case 'broker':
        break;
      case 'state':
        break;
      default:
        break;
    }
    this.filterDoughnutChart(this.params);
  }
}
