import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { AnimatedDigitComponent } from './animated-digit/animated-digit.component';
import { DashboardStatsComponent } from './dashboard-stats/dashboard-stats.component';
import { DashboardSmallTablesComponent } from './dashboard-small-tables/dashboard-small-tables.component';
import { SmallFlipCardsComponent } from './dashboard-small-tables/small-flip-cards/small-flip-cards.component';
import { DashboardLoadTableComponent } from './dashboard-load-table/dashboard-load-table.component';
import { DashboardChartsComponent } from './dashboard-charts/dashboard-charts.component';
import { DashboardInvChartComponent } from './dashboard-charts/dashboard-inv-chart/dashboard-inv-chart.component';
import { DashboardPerformanceChartComponent } from './dashboard-charts/dashboard-performance-chart/dashboard-performance-chart.component';
import { ChartModule } from 'angular2-chartjs';
import { DashboardHistoryComponent } from './dashboard-history/dashboard-history.component';
import { DashboardWeatherComponent } from './dashboard-weather/dashboard-weather.component';
import { DashboardWeatherMapComponent } from './dashboard-weather/dashboard-weather-map/dashboard-weather-map.component';
import { DashboardWeatherCitiesComponent } from './dashboard-weather/dashboard-weather-cities/dashboard-weather-cities.component';
import { DashboardWeatherInfoComponent } from './dashboard-weather/dashboard-weather-info/dashboard-weather-info.component';
import { DashboardFuelComponent } from './dashboard-fuel/dashboard-fuel.component';
import { DashboardTodoComponent } from './dashboard-todo/dashboard-todo.component';

import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import { DashboardWeatherInfoWeathersComponent } from './dashboard-weather/dashboard-weather-info/dashboard-weather-info-weathers/dashboard-weather-info-weathers.component';
import { DashboardCalendarCustomComponent } from './dashboard-calendar-custom/dashboard-calendar-custom.component';
import { DashboardWeatherBarsComponent } from './dashboard-weather/dashboard-weather-info/dashboard-weather-bars/dashboard-weather-bars.component';
import { DashboardStateTrackingComponent } from './dashboard-state-tracking/dashboard-state-tracking.component';
import { DashboardVehicleChartComponent } from './dashboard-charts/dashboard-vehicle-chart/dashboard-vehicle-chart.component';
import { DashboardLoadingChartComponent } from './dashboard-charts/dashboard-loading-chart/dashboard-loading-chart.component';
import { DashboardStatusesComponent } from './dashboard-statuses/dashboard-statuses.component';
import { DashboardStatusOthersComponent } from './dashboard-status-others/dashboard-status-others.component';
import { DashboardStateUsaComponent } from './dashboard-state-tracking/dashboard-state-usa/dashboard-state-usa.component';
import { DashboardRoadInspectionComponent } from './dashboard-road-inspection/dashboard-road-inspection.component';


FullCalendarModule.registerPlugins([dayGridPlugin, listPlugin]);
@NgModule({
  declarations: [DashboardComponent, AnimatedDigitComponent, DashboardStatsComponent, DashboardSmallTablesComponent, SmallFlipCardsComponent, DashboardLoadTableComponent, DashboardChartsComponent, DashboardInvChartComponent, DashboardPerformanceChartComponent, DashboardHistoryComponent, DashboardWeatherComponent, DashboardWeatherMapComponent, DashboardWeatherCitiesComponent, DashboardWeatherInfoComponent, DashboardFuelComponent, DashboardTodoComponent, DashboardWeatherInfoWeathersComponent, DashboardCalendarCustomComponent, DashboardWeatherBarsComponent, DashboardStateTrackingComponent, DashboardVehicleChartComponent, DashboardLoadingChartComponent, DashboardStatusesComponent, DashboardStatusOthersComponent, DashboardStateUsaComponent, DashboardRoadInspectionComponent],
  imports: [CommonModule, FullCalendarModule, DashboardRoutingModule, SharedModule, ChartModule],
  entryComponents: [],
})
export class DashboardModule {}
