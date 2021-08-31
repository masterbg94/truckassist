import { DashboardService } from './../../../core/services/dashboard.service';
import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import * as Chart from 'chart.js';
@Component({
  selector: 'app-dashboard-performance-chart',
  templateUrl: './dashboard-performance-chart.component.html',
  styleUrls: ['./dashboard-performance-chart.component.scss']
})
export class DashboardPerformanceChartComponent implements OnInit, OnDestroy {

  @ViewChild('chart') chart: any;
  selectedTime = 'all';
  selectedPeriod = 'day';

  choosenCategoryList = [];
  hoveredCategory: any;
  hoveredItemTip: any = [];
  hoveredItemTipSave: any = [];
  categoryList: any = [
    {
      name: 'Load',
      color: '#24C1A1',
      active: true
    },
    {
      name: 'Revenue',
      color: '#5673AA',
      active: true
    },
    {
      name: 'Avg. Rate',
      color: '#50A8FB'
    },
    {
      name: 'Driver',
      color: '#FA9952'
    },
    {
      name: 'Mile',
      color: '#A16CAF'
    },
    {
      name: 'Repair',
      color: '#FF5D5D'
    },
    {
      name: 'Expense',
      color: '#CF3991'
    },
    {
      name: 'Shipper',
      color: '#00C4BB'
    },
    {
      name: 'Broker',
      color: '#008C8F'
    },
    {
      name: 'Truck',
      color: '#E3AF03'
    },
    {
      name: 'Trailer',
      color: '#EDC620'
    },
    {
      name: 'Accident',
      color: '#E61D18'
    },
    {
      name: 'Fuel Cost',
      color: '#C18920'
    },
    {
      name: 'Avg. Fuel',
      color: '#90610B'
    }
  ];

  timeList: any = [
    {
      id: 1,
      name: 'All time',
      value: 'all'
    },
    {
      id: 2,
      name: 'Today',
      value: 'today'
    },
    {
      id: 3,
      name: 'WTD',
      value: 'wtd'
    },
    {
      id: 4,
      name: 'MTD',
      value: 'mtd'
    },
    {
      id: 5,
      name: 'YTD',
      value: 'ytd'
    },
    {
      id: 6,
      name: 'Custom',
      value: 'custom'
    }
  ];

  perdioList: any = [
    {
      id: 1,
      name: 'Daily',
      value: 'day'
    },
    {
      id: 2,
      name: 'Weekly',
      value: 'week'
    },
    {
      id: 3,
      name: 'Monthly',
      value: 'month'
    },
    {
      id: 4,
      name: 'Quarterly',
      value: 'quarter'
    },
    {
      id: 5,
      name: 'Yearly',
      value: 'year'
    }
  ];

  
  type = 'LineWithLine';
  data: any = {
    hover: {
      intersect: false
    },
    labels: [['JUN', '15th', '2019'], ['MAR', '15th', '2019'], ['APR', '15th', '2019'], ['AUG', '15th', '2019'], ['OKT', '15th', '2019'], ['NOV', '15th', '2019'], ['Aug', '15th', '2019']],
    datasets: [
      {
        data: [5, 20, 30, 40, 50, 60, 70],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#24C1A1',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#24C1A1'
      },
      {
        data: [7, 22, 35, 45, 55, 65, 75],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#5673AA',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#5673AA'
      },
      {
        data: [10, 35, 75, 25, 16, 35, 18],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#50A8FB',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#50A8FB',
        hidden: true
      },
      {
        data: [5, 25, 55, 35, 85, 45, 20],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#FA9952',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#FA9952',
        hidden: true
      },
      {
        data: [2, 15, 75, 50, 45, 80, 70],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#A16CAF',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#A16CAF',
        hidden: true
      },
      {
        data: [20, 25, 35, 10, 80, 95, 55],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#FF5D5D',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#FF5D5D',
        hidden: true
      },
      {
        data: [30, 32, 35, 40, 45, 50, 55],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#CF3991',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#CF3991',
        hidden: true
      },
      {
        data: [25, 32, 33, 34, 37, 38, 39],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#00C4BB',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#00C4BB',
        hidden: true
      },
      {
        data: [40, 41, 42, 43, 44, 45, 46],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#008C8F',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#008C8F',
        hidden: true
      },
      {
        data: [47, 48, 49, 50, 51, 52, 53],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#E3AF03',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#E3AF03',
        hidden: true
      },
      {
        data: [54, 55, 56, 57, 58, 59, 60],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#EDC620',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#EDC620',
        hidden: true
      },
      {
        data: [61, 62, 63, 64, 65, 66, 67],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#E61D18',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#E61D18',
        hidden: true
      },
      {
        data: [68, 69, 70, 71, 72, 73, 74],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#C18920',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#C18920',
        hidden: true
      },
      {
        data: [75, 76, 77, 78, 79, 80, 81],
        backgroundColor: 'rgba(255, 255, 255, 0)',
        borderColor: '#90610B',
        pointBorderColor: 'rgba(0, 0, 0, 0)',
        pointBackgroundColor: 'rgba(0, 0, 0, 0)',
        pointHoverBorderColor: '#fff',
        pointHoverBackgroundColor: '#90610B',
        hidden: true
      }
    ]
  };
  options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        yAxes: [{
            ticks: {
                display: false
            },
            gridLines: {
              display: false
            }
        }],
        xAxes: [{
          ticks: {
            fontSize: 12,
            fontColor: '#DADADA',
            fontWeight: 10,
            lineHeight: 1.4,
            callback: (value, index, values) => {
              if ( index == 0 || index == (values.length - 1) || this.hoveredItemTip?.join('') == value.join(',')) { return value; }
            },
          },
          gridLines: {
            display: false
          }
        }]
    },
    legend: {
        display: false
    },
    plugins: {
      datalabels: {
        display(context) {
          return false;
        }
      }
    },
    tooltips: {
        enabled: false,
        yAlign: 'top',
        mode: 'x-axis',
        position: 'average',
        intersect: false,
        // callbacks: {
        //   label: function(tooltipItem) {
        //     console.log("tolltipeitem");
        //     console.log(tooltipItem);
        //           //return tooltipItem.yLabel;
        //   }
        // }
        custom: (tooltipModel) => {
          this.hoveredItemTip = tooltipModel.title;
          let tooltipEl = (document.getElementById('chartjs-tooltip') as HTMLInputElement);
           // Create element on first render
          if (!tooltipEl) {
                tooltipEl = (document.createElement('div') as HTMLInputElement);
                tooltipEl.id = 'chartjs-tooltip';
                tooltipEl.innerHTML = '<div class="chart_custom_tooltip"></div>';
                document.body.appendChild(tooltipEl);
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
                const titleLines = tooltipModel.title || [];
                const bodyLines = tooltipModel.body.map(getBody);
                const dataPointsIndx = tooltipModel.dataPoints[0];
                let innerHtml = '<div class="chart_tooltip_main">';
                bodyLines.forEach((body, i) => {
                  let item = '';
                  let color = '';
                  switch (i) {
                    case 0:
                      item = 'Load';
                      color = '#24C1A1';
                      break;
                    case 1:
                      item = 'Revenue';
                      color = '#5673AA';
                      break;
                    case 2:
                      item = 'Avg. Rate';
                      color = '#50A8FB';
                      break;
                    case 3:
                      item = 'Driver';
                      color = '#FA9952';
                      break;
                    case 4:
                      item = 'Mile';
                      color = '#A16CAF';
                      break;
                    case 5:
                      item = 'Repair';
                      color = '#FF5D5D';
                      break;
                    case 6:
                      item = 'Expense';
                      color = '#CF3991';
                      break;
                    case 7:
                      item = 'Shipper';
                      color = '#00C4BB';
                      break;
                    case 8:
                      item = 'Broker';
                      color = '#008C8F';
                      break;
                    case 9:
                      item = 'Truck';
                      color = '#E3AF03';
                      break;
                    case 10:
                      item = 'Trailer';
                      color = '#EDC620';
                      break;
                    case 11:
                      item = 'Accident',
                      color = '#E61D18';
                      break;
                    case 12:
                      item = 'Fuel Cost';
                      color = '#C18920';
                      break;
                    case 13:
                      item = 'Avg. Fuel';
                      color = '#90610B';
                      break;
                    default:
                      break;
                  }
                  innerHtml += `
                                <div class="tooltip_holder">
                                  <span style="color: ${color}">${item}</span>
                                  <span>$${parseInt(body).toFixed(2)}</span>
                                </div>
                              `;
                });
                innerHtml += '</div>';

                const tableRoot = tooltipEl.querySelector('.chart_custom_tooltip') as HTMLElement;
                tableRoot.style.display = "block";
                tableRoot.innerHTML = innerHtml;
            }

            // `this` will be the overall tooltip
          const position = this.chart.canvas.getBoundingClientRect();
            // Display, position, and set styles for font
          tooltipEl.style.opacity = '1';
          tooltipEl.style.position = 'absolute';
          tooltipEl.style.zIndex = '200';
          tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - 61 + 'px';
          tooltipEl.style.top = position.top + window.scrollY - tooltipEl.clientHeight - 5 + 'px';
          tooltipEl.style.pointerEvents = 'none';

          if ( this.hoveredItemTipSave.join('') != this.hoveredItemTip.join('') ) {
              this.chart.chart.chart.update();
              this.hoveredItemTipSave = this.hoveredItemTip;
            }

        }
    }
  };


  updateChart():void{
    var tooltip = document.querySelector('.chart_tooltip_main') as HTMLElement;
    if( tooltip ){
      tooltip.style.display = "none";
      const parent = tooltip.parentNode as HTMLElement;
      parent.style.display = "none";
      this.chart.chart.chart.update();
    }
  }


  constructor(public dashboardService: DashboardService) { }
  kFormatter(num: number) {
      return;
  }

  ngOnInit(): void {
    // this.getChartData();
    this.drawGraphLine();
  }

  ngOnDestroy(){
    this.updateChart();
  }


  getChartData(): void {
    // this.dashboardService.getChartData(this.choosenCategoryList.toLocaleLowerCase(), this.selectedTime, this.selectedPeriod).subscribe(res =>{
    //   console.log("CHART DATA RES");
    //   console.log(res);
    // });
  }

  chooseCategory(chart, indx: number): void {
    this.categoryList[indx].active = !this.categoryList[indx].active;
    chart.chart.getDatasetMeta(indx).hidden = !this.categoryList[indx].active;
    chart.chart.update();
    this.hoveredItemTipSave = [];
    // const itemIndx = this.choosenCategoryList.indexOf(item);
    // if( itemIndx > -1 ) this.choosenCategoryList.splice(itemIndx, 1);
    // else this.choosenCategoryList.push(item);

  }

  public drawGraphLine() {
    Chart.defaults.LineWithLine = Chart.defaults.line;
    Chart.controllers.LineWithLine = Chart.controllers.line.extend({
    draw(ease) {
      Chart.controllers.line.prototype.draw.call(this, ease);

      if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
            const activePoint = this.chart.tooltip._active[0],
                ctx = this.chart.ctx,
                x = activePoint.tooltipPosition().x,
                topY = this.chart.legend.bottom,
                bottomY = this.chart.chartArea.bottom;
            // draw line
            ctx.save();
            ctx.beginPath();
            ctx.setLineDash([2, 3]);
            ctx.moveTo(x, topY);
            ctx.lineTo(x, bottomY);
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = '#5673AA70';
            ctx.stroke();
            ctx.restore();
          }
      }
    });
  }

}
