import { DashboardService } from './../../core/services/dashboard.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-charts',
  templateUrl: './dashboard-charts.component.html',
  styleUrls: ['./dashboard-charts.component.scss']
})
export class DashboardChartsComponent implements OnInit {

  constructor(public dashboardService: DashboardService) { }

  ngOnInit(): void {
  }



}
