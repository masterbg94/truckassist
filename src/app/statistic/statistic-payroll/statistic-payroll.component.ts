import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TableData } from 'src/app/shared/truckassist-table/models/truckassist-table';
import { DatePipe } from '@angular/common';
import { StatisticService } from 'src/app/core/services/statistic.service';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-statistic-payroll',
  templateUrl: './statistic-payroll.component.html',
  styleUrls: ['./statistic-payroll.component.scss'],
  providers: [DatePipe],
})
export class StatisticPayrollComponent implements OnInit, AfterViewInit, OnDestroy {
  charts = [];
  customHtml;
  cropChart = false;
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
      total_payroll: '$3.24K',
      salary: '$2.76K',
      bonus: '$823',
      credit: '$267',
      deduction: '$123',
      miles: '597',
      loaded: '321',
      empty: '356',
      active: false,
    },
    {
      driverId: 1,
      name: 'Angelo Trotter',
      total_payroll: '$3.24K',
      salary: '$2.76K',
      bonus: '$823',
      credit: '$267',
      deduction: '$123',
      miles: '457',
      loaded: '321',
      empty: '231',
      active: false,
    },
    {
      driverId: 2,
      name: 'Jerry Smith',
      total_payroll: '$3.24K',
      salary: '$2.76K',
      bonus: '$823',
      credit: '$267',
      deduction: '$123',
      miles: '324',
      loaded: '321',
      empty: '231',
      active: false,
    },
    {
      driverId: 3,
      name: 'Beth White',
      total_payroll: '$3.24K',
      salary: '$2.76K',
      bonus: '$823',
      credit: '$267',
      deduction: '$123',
      miles: '542',
      loaded: '321',
      empty: '231',
      active: false,
    },
    {
      driverId: 4,
      name: 'Fraight Gustavo',
      total_payroll: '$3.24K',
      salary: '$2.76K',
      bonus: '$823',
      credit: '$267',
      deduction: '$123',
      miles: '543',
      loaded: '321',
      empty: '231',
      active: false,
    },
    {
      driverId: 5,
      name: 'Walter Hanks',
      total_payroll: '$3.24K',
      salary: '$2.76K',
      bonus: '$823',
      credit: '$267',
      deduction: '$123',
      miles: '235',
      loaded: '321',
      empty: '231',
      active: false,
    },
    {
      driverId: 6,
      name: 'Michael Scott',
      total_payroll: '$3.24K',
      salary: '$2.76K',
      bonus: '$823',
      credit: '$267',
      deduction: '$123',
      miles: '523',
      loaded: '321',
      empty: '231',
      active: false,
    },
    {
      driverId: 7,
      name: 'Jessie Pinkman',
      total_payroll: '$3.24K',
      salary: '$2.76K',
      bonus: '$823',
      credit: '$267',
      deduction: '$123',
      miles: '324',
      loaded: '321',
      empty: '231',
      active: false,
    },
    {
      driverId: 8,
      name: 'Dwight K. Schrute',
      total_payroll: '$3.24K',
      salary: '$2.76K',
      bonus: '$823',
      credit: '$267',
      deduction: '$123',
      miles: '872',
      loaded: '321',
      empty: '231',
      active: false,
    },
  ];

  /* Charts  */
  @ViewChild('chartBar') chartBar: any;
  @ViewChild('chartLine') chartLine: any;
  @ViewChild('chartLine2') chartLine2: any;
  @ViewChild('chartDoug') chartDoug: any;
  @ViewChild('chartDoug2') chartDoug2: any;
  /* Randomize Bar and Line Data */
  randomsPlus = [...Array(25)].map(() => {
    const item = {
      x: Math.floor(Math.random() * 36) + 1,
      y: Math.floor(Math.random() * 36) + 1,
    };
    return item;
  });
  randomsPlus2 = [...Array(25)].map(() => {
    const item = {
      x: Math.floor(Math.random() * 10) + 1,
      y: Math.floor(Math.random() * 10) + 1,
    };
    return item;
  });
  randomsMinus = [...Array(25)].map(() => {
    const item = {
      x: Math.floor(Math.random() * 5) - 10,
      y: Math.floor(Math.random() * 5) - 10,
    };
    return item;
  });
  randomLine = [...Array(25)].map(() => Math.floor(Math.random() * 36));
  randomstring = [...Array(25)].map(() => 'Nov ' + Math.floor(Math.random() * 9) + 'th, 2020');
  /* Data Bar Chart */
  dataBar: any = {
    hover: {
      intersect: false,
    },
    labels: this.randomstring,
    datasets: [
      {
        label: 'Salary',
        data: this.randomsPlus,
        backgroundColor: '#5673AAc6',
        borderColor: '#5673AA',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#FFAD43',
        barPercentage: 1.25,
        categoryPercentage: 0.65,
        order: 1,
        stack: '0',
      },
      {
        label: 'Bonus',
        data: this.randomsPlus2,
        backgroundColor: '#FFAD43c6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#5673AA',
        borderSkipped: false,
        barPercentage: 1.25,
        categoryPercentage: 0.65,
        order: 2,
        stack: '0',
      },
      {
        label: 'Credit',
        data: this.randomsMinus,
        backgroundColor: '#24C1A1c6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#24C1A1',
        borderSkipped: false,
        barPercentage: 1.25,
        categoryPercentage: 0.65,
        order: 3,
        stack: '0',
      },
      {
        label: 'Deduction',
        data: this.randomsMinus,
        backgroundColor: '#FF5D5Dc6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#FF5D5D',
        borderSkipped: false,
        barPercentage: 1.25,
        categoryPercentage: 0.65,
        order: 4,
        stack: '0',
      },
      {
        label: 'Total',
        data: this.randomLine,
        backgroundColor: '#A16CAFc6',
        borderColor: '#A16CAFc6',
        pointBorderColor: '#A16CAFc6',
        pointBackgroundColor: '#fff',
        pointHoverBorderColor: '#A16CAFc6',
        pointHoverBackgroundColor: '#A16CAFc6',
        pointBorderWidth: 3,
        borderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 4,
        order: 0,
        type: 'line',
        fill: false,
      },
      {
        label: 'Loaded',
        data: this.randomsPlus2,
        backgroundColor: '#919191c6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#919191',
        borderSkipped: false,
        barPercentage: 1,
        categoryPercentage: 0.65,
        order: 5,
        stack: '1',
      },
      {
        label: 'Empty',
        data: this.randomsPlus2,
        backgroundColor: '#B7B7B7c6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#B7B7B7',
        borderSkipped: false,
        barPercentage: 1,
        categoryPercentage: 0.65,
        order: 6,
        stack: '1',
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
            let widthBig;
            let widthSmall;
            const item = data?.datasets[tooltipItem.datasetIndex]?.data[tooltipItem.index];
            const type = data?.datasets[tooltipItem.datasetIndex]?._meta[0]?.type;
            const label = data?.datasets[tooltipItem.datasetIndex]?.label;
            const i = 100;
            for (let index = 0; index < i; index++) {
              widthBig = data?.datasets[0]?._meta[index]?.data[0]?._model.width;
              if (widthBig > 0) {
                break;
              }
            }
            for (let index = 0; index < i; index++) {
              widthSmall = data?.datasets[5]?._meta[index]?.data[0]?._model.width;
              if (widthSmall > 0) {
                break;
              }
            }
            return { item, type, label, widthBig, widthSmall };
          }
        },
      },
      custom(tooltipModel) {
        let tooltipEl = document.getElementById('chartjs-tooltip-payroll') as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-payroll';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_statistics_payroll"></div>';
          // document.body.appendChild(tooltipEl);
          document.getElementById('chart-group-payroll-statistics').appendChild(tooltipEl);
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
          const miles = 10;
          const bodyLines = tooltipModel.body.map(getBody);
          let innerHtml = '<div style="display: -webkit-box; -webkit-box-orient: vertical;">';
          this.lengthBodyTooltip = bodyLines.length;
          // miles = +bodyLines[5][0].item.x + +bodyLines[6][0].item.x;
          let titleDirection = '';
          if (tooltipModel.dataPoints[0].x > 40 && tooltipModel.dataPoints[0].x < 1150) {
            titleDirection = '';
          } else if (tooltipModel.dataPoints[0].x < 40) {
            titleDirection = 'right';
          } else {
            titleDirection = 'left';
          }
          let dollarsBool = false;
          let milesBool = false;
          let emptyPerBool = false;
          bodyLines.forEach((body, i) => {
            let growItem = '';
            let theClass = '';
            switch (body[0].label) {
              case 'Salary':
                growItem = 'Salary';
                theClass = 'salary';
                dollarsBool = true;
                break;
              case 'Bonus':
                growItem = 'Bonus';
                theClass = 'bonus';
                dollarsBool = true;
                break;
              case 'Credit':
                growItem = 'Credit';
                theClass = 'credit';
                dollarsBool = true;
                break;
              case 'Deduction':
                growItem = 'Deduction';
                theClass = 'deduction';
                dollarsBool = true;
                break;
              case 'Total':
                growItem = 'Total';
                theClass = 'total';
                emptyPerBool = true;
                break;
              case 'Loaded':
                growItem = 'Loaded';
                theClass = 'loaded';
                milesBool = true;
                break;
              case 'Empty':
                growItem = 'Empty';
                theClass = 'empty';
                milesBool = true;
                break;
              default:
                break;
            }
            if (dollarsBool) {
              innerHtml += `<p class="${theClass}">
                              ${growItem}
                              <span class="value"> $${body[0].item.x},000</span>
                              <span class="per"> ${body[0].item.y}%</span>
                            </p>`;
            } else if (milesBool) {
              innerHtml += `<p class="${theClass}">
                              ${growItem}
                              <span class="value"> ${body[0].item.x}00</span>
                              <span class="per"> ${body[0].item.y}%</span>
                            </p>`;
            } else if (emptyPerBool) {
              innerHtml += `<p class="${theClass}">
                              ${growItem}
                              <span class="value"> $${body[0].item},000</span>
                            </p>`;
            }

            dollarsBool = false;
            milesBool = false;
            emptyPerBool = false;
          });
          innerHtml += `<p class="miles">Miles
                        <span > ${miles}00</span>
                        </p>`;
          innerHtml += '</div>';
          innerHtml += `<p class="title ${titleDirection}">${title}</p>`;

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_statistics_payroll');
          tableRoot.innerHTML = innerHtml;
        }
        // Set caret Position
        tooltipEl.classList.remove('above', 'below', 'no-transform');
        if (tooltipModel.yAlign) {
          tooltipEl.className = 'custom-caret';
          if (this.lengthBodyTooltip === 6) {
            tooltipEl.className = 'custom-caret-six';
          }
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
          tooltipModel.body[0].lines[0].widthBig + tooltipModel.body[0].lines[0].widthBig + 'px';
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
        data: this.randomsPlus,
        backgroundColor: '#A16CAFc6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#A16CAF',
        barPercentage: 1,
        categoryPercentage: 0.7,
        tension: 0.4,
        order: 0,
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
  /* Data Line 2 Chart */
  dataLine2: any = {
    type: 'line',
    hover: {
      intersect: false,
    },
    labels: this.randomstring,
    datasets: [
      {
        data: this.randomsPlus2,
        backgroundColor: '#919191c6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#919191c6',
        barPercentage: 1,
        fill: true,
        categoryPercentage: 0.7,
        tension: 0.4,
        order: 0,
      },
      {
        data: this.randomsPlus2,
        backgroundColor: '#B7B7B7c6',
        borderColor: 'rgba(0, 0, 0, 0)',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#B7B7B7c6',
        barPercentage: 1,
        categoryPercentage: 0.7,
        fill: true,
        tension: 0.4,
        order: 1,
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
  public selectedTab = '';
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
  ];

  /* Dummy Data for widgets */
  widgetsData = [
    { i: 0, indexId: 4, num: '$302K', per: '', title: 'Total', active: true },
    { i: 1, indexId: 0, num: '$245K', per: '+74.5%', title: 'Salaray', active: true },
    { i: 2, indexId: 1, num: '$64.2K', per: '+25.5%', title: 'Bonus', active: true },
    { i: 3, indexId: 2, num: '$36.7K', per: '-13.4%', title: 'Credit', active: true },
    { i: 4, indexId: 3, num: '$45.3K', per: '-13.5%', title: 'Deduction', active: true },
    { i: 5, indexId: 11, num: '30.64K', per: '', title: 'Total Miles', active: true },
    { i: 6, indexId: 5, num: '18.75K', per: '72.4%', title: 'Loaded', active: true },
    { i: 7, indexId: 6, num: '6.56K', per: '27.6%', title: 'Empty Miles', active: true },
  ];
  /* Min Max Dummy data */
  minMaxData = [
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '$17.3K',
      countHigh: '$24.4K',
      title: 'Total Payroll',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '$17.3K',
      countHigh: '$24.4K',
      title: 'Salary',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '$17.3K',
      countHigh: '$24.4K',
      title: 'Bonus',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '$17.3K',
      countHigh: '$24.4K',
      title: 'Credit',
    },
    {
      dateLow: 'Sep 19',
      dateHigh: 'Jan 21',
      countLow: '$17.3K',
      countHigh: '$24.4K',
      title: 'Deductions',
    },
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
  ];
  hoveredIndex = -1;
  /* Normal and hover background color for doughnout charts */
  chartCollors: any = [
    {
      hovered: '#A16CAF',
      normal: '#A16CAF42',
      original: '#A16CAFc7',
    },
    {
      hovered: '#5673AA',
      normal: '#5673AA42',
      original: '#5673AAc7',
    },
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
      hovered: '#FF5D5D',
      normal: '#FF5D5D42',
      original: '#FF5D5Dc7',
    },
  ];
  chartCollors2: any = [
    {
      hovered: '#6C6C6C',
      normal: '#6C6C6C42',
      original: '#6C6C6Cc7',
    },
    {
      hovered: '#919191',
      normal: '#91919142',
      original: '#919191c7',
    },
    {
      hovered: '#B7B7B7',
      normal: '#B7B7B742',
      original: '#B7B7B7c7',
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
        data: [3, 2, 3, 6, 5, 6, 4, 8, 2],
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
        data: [9, 6, 5, 2, 4, 8, 1, 2, 6],
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
          'chartjs-tooltip-payroll-doughnut-drivers'
        ) as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-payroll-doughnut-drivers';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_drivers_payroll"></div>';
          document.getElementById('chart-doughnut-one-payroll-statistics').appendChild(tooltipEl);
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

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_drivers_payroll');
          tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '200';
        tooltipEl.style.left = '155px';
        tooltipEl.style.top = '95px';
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
          '#919191c7',
          '#919191c7',
          '#919191c7',
          '#919191c7',
          '#919191c7',
          '#919191c7',
          '#919191c7',
          '#919191c7',
          '#919191c7',
        ],
        borderWidth: 4,
      },
      {
        data: [4, 1, 3, 7, 5, 6, 4, 9, 3],
        backgroundColor: [
          '#B7B7B7c7',
          '#B7B7B7c7',
          '#B7B7B7c7',
          '#B7B7B7c7',
          '#B7B7B7c7',
          '#B7B7B7c7',
          '#B7B7B7c7',
          '#B7B7B7c7',
          '#B7B7B7c7',
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
    cutoutPercentage: 70,
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
          'chartjs-tooltip-payroll-doughnut-miles'
        ) as HTMLInputElement;
        // Create element on first render
        if (!tooltipEl) {
          tooltipEl = document.createElement('div') as HTMLInputElement;
          tooltipEl.id = 'chartjs-tooltip-payroll-doughnut-miles';
          tooltipEl.innerHTML = '<div class="chart_custom_tooltip_miles_payroll"></div>';
          // document.body.appendChild(tooltipEl);
          document.getElementById('chart-doughnut-two-payroll-statistics').appendChild(tooltipEl);
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

          const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip_miles_payroll');
          tableRoot.innerHTML = innerHtml;
        }

        // `this` will be the overall tooltip
        const position = this._chart.canvas.getBoundingClientRect();
        // Display, position, and set styles for font
        tooltipEl.style.opacity = '1';
        tooltipEl.style.position = 'absolute';
        tooltipEl.style.zIndex = '200';
        tooltipEl.style.left = '155px';
        tooltipEl.style.top = '95px';
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
    for (const i of [0, 1, 2, 3, 4, 5, 6]) {
      this.chartBar.chart.getDatasetMeta(i).hidden = false;
    }
    this.chartLine.chart.getDatasetMeta(0).hidden = false;
    this.chartLine2.chart.getDatasetMeta(0).hidden = false;
    this.chartLine2.chart.getDatasetMeta(1).hidden = false;
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
    this.chartLine2.chart.config.type = type;
    if (!style) {
      this.chartLine.chart.config.data.datasets[0].fill = style;
      this.chartLine2.chart.config.data.datasets[0].fill = style;
      this.chartLine2.chart.config.data.datasets[1].fill = style;
      this.chartLine.chart.config.data.datasets[0].borderColor = '#FF5D5D6d';
      this.chartLine.chart.config.data.datasets[0].borderWidth = '2';
    } else {
      this.chartLine.chart.config.data.datasets[0].fill = style;
      this.chartLine2.chart.config.data.datasets[0].fill = style;
      this.chartLine2.chart.config.data.datasets[1].fill = style;
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
          if (i === 4 || i === 5 || i === 6) {
            element.fill = fill;
            element.borderColor = '#ffffff00';
            element.backgroundColor = '#ffffff00';
            element.borderColor = '#ffffff00';
            element.borderWidth = '#ffffff00';
            element.pointBorderColor = '#ffffff00';
            element.pointBorderWidth = '#ffffff00';
            element.pointBackgroundColor = '#ffffff00';
            element.pointHoverBackgroundColor = '#ffffff00';
            element.pointHoverBorderColor = '#ffffff00';
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
      this.chartBar.chart.config.data.datasets.forEach((element, i) => {
        if (i === 5) {
          element.fill = style;
          element.borderColor = '#919191c6';
          element.backgroundColor = '#919191c6';
          element.pointHoverBackgroundColor = '#919191';
        }
        if (i === 6) {
          element.fill = style;
          element.borderColor = '#B7B7B7c6';
          element.backgroundColor = '#B7B7B7c6';
          element.pointHoverBackgroundColor = '#B7B7B7';
        }
      });
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
        this.chartBar.chart.config.data.datasets[4].backgroundColor = '#A16CAFc6';
        this.chartBar.chart.config.data.datasets[4].borderColor = '#A16CAFc6';
        this.chartBar.chart.config.data.datasets[4].borderWidth = 2;
        this.chartBar.chart.config.data.datasets[4].pointBorderColor = '#A16CAFc6';
        this.chartBar.chart.config.data.datasets[4].pointBorderWidth = 3;
        this.chartBar.chart.config.data.datasets[4].pointBackgroundColor = '#fff';
        this.chartBar.chart.config.data.datasets[4].pointHoverBackgroundColor = '#A16CAFc6';
        this.chartBar.chart.config.data.datasets[4].pointHoverBorderColor = '#A16CAFc6';
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
      chart2.chart.getDatasetMeta(2).data
    );
    allOtherElements.push(
      chart.chart.getDatasetMeta(0).data,
      chart.chart.getDatasetMeta(1).data,
      chart.chart.getDatasetMeta(2).data,
      chart.chart.getDatasetMeta(3).data,
      chart.chart.getDatasetMeta(4).data
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
      chart2.chart.getDatasetMeta(2).data[dataId]
    );
    activeElements.push(
      chart.chart.getDatasetMeta(0).data[dataId],
      chart.chart.getDatasetMeta(1).data[dataId],
      chart.chart.getDatasetMeta(2).data[dataId],
      chart.chart.getDatasetMeta(3).data[dataId],
      chart.chart.getDatasetMeta(4).data[dataId]
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
    if (this.chartTypeData[0].checked === true) {
      if (indexId !== 11) {
        const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
        this.widgetsData[theElement[0].i].active = !active;
        this.chartBar.chart.getDatasetMeta(indexId).hidden = active;
        this.chartBar.chart.update();
      }
    } else if (this.chartTypeData[1].checked === true) {
      if (indexId !== 11 && indexId !== 4) {
        const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
        this.widgetsData[theElement[0].i].active = !active;
        this.chartBar.chart.getDatasetMeta(indexId).hidden = active;
        this.chartBar.chart.update();
      }
      if (indexId === 4) {
        const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
        this.widgetsData[theElement[0].i].active = !active;
        this.chartLine.chart.getDatasetMeta(0).hidden = active;
        this.chartLine.chart.update();
      }
    } else if (this.chartTypeData[2].checked === true) {
      if (indexId !== 11 && indexId !== 5 && indexId !== 6 && indexId !== 4) {
        const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
        this.widgetsData[theElement[0].i].active = !active;
        this.chartBar.chart.getDatasetMeta(indexId).hidden = active;
        this.chartBar.chart.update();
      }
      if (indexId === 5 || indexId === 6) {
        const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
        this.widgetsData[theElement[0].i].active = !active;
        this.chartLine2.chart.getDatasetMeta(indexId - 5).hidden = active;
        this.chartLine2.chart.update();
      }
      if (indexId === 4) {
        const theElement = this.widgetsData.filter((e) => e.indexId === indexId);
        this.widgetsData[theElement[0].i].active = !active;
        this.chartLine.chart.getDatasetMeta(0).hidden = active;
        this.chartLine.chart.update();
      }
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
