import { ReportsModule } from './reports/reports.module';
import { TestgpsModule } from './testgps/testgps.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './base.component';
import { AuthGuard } from './core/guards/authentication.guard';
import { LoginComponent } from './core/authentication/login/login.component';
// import { RegisterComponent } from './core/authentication/register/register.component';
import { ResetPasswordComponent } from './core/authentication/reset-password/reset-password.component';
import { AppNoPageFoundComponent } from './shared/app-no-page-found/app-no-page-found.component';
import { ReportsComponent } from './reports/reports-list/reports.component';
import { RoutingComponent } from './routing/routing.component';
import { ShopMapComponent } from './repairs/shop-map/shop-map.component';
import { GpsComponent } from './gps/gps.component';
import { TruckassistReveiwComponent } from './shared/truckassist-reveiw/truckassist-reveiw.component';

import { MilesComponent } from './miles/miles.component';
import { TaCardComponent } from './shared/ta-card/ta-card.component';

const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then((a) => a.DashboardModule),
      },
      {
        path: 'drivers',
        loadChildren: () => import('./driver/driver.module').then((a) => a.DriverModule),
      },
      {
        path: 'payments',
        loadChildren: () =>
          import('./payment-test/payment-test.module').then((a) => a.PaymentTestModule),
      },
      {
        path: 'trucks',
        loadChildren: () => import('./truck/truck.module').then((a) => a.TruckModule),
      },
      {
        path: 'trailers',
        loadChildren: () => import('./trailer/trailer.module').then((a) => a.TrailerModule),
      },
      {
        path: 'tools/todo',
        loadChildren: () => import('./todo/todo.module').then((a) => a.TodoModule),
      },
      {
        path: 'safety',
        loadChildren: () => import('./safety/safety.module').then((a) => a.SafetyModule),
      },
      {
        path: 'repairs',
        loadChildren: () => import('./repairs/repairs.module').then((a) => a.RepairsModule),
      },
      {
        path: 'loads',
        loadChildren: () => import('./load/load.module').then((a) => a.LoadModule),
      },
      {
        path: 'dispatcher',
        loadChildren: () =>
          import('./dispatcher/dispatcher.module').then((a) => a.DispatcherModule),
      },
      {
        path: 'customers',
        loadChildren: () => import('./customer/customer.module').then((a) => a.CustomerModule),
      },
      {
        path: 'page-not-found',
        component: AppNoPageFoundComponent,
        data: { title: 'Page Not Found' },
      },
      {
        path: 'tools',
        component: AppNoPageFoundComponent,
        data: { title: 'Tools' },
      },
      {
        path: 'tools/gpstracking',
        component: GpsComponent,
        data: { title: 'GPS tracking' },
      },
      {
        path: 'tools/routing',
        component: RoutingComponent,
        data: { title: 'Routing' },
      },
      {
        path: 'tools/miles',
        component: MilesComponent,
        data: { title: 'Routing' },
      },
      {
        path: 'tools/routing/:mode',
        component: RoutingComponent,
        data: { title: 'Routing' },
      },
      {
        path: 'tools/2290',
        loadChildren: () => import('./tax2290/tax2290.module').then((a) => a.Tax2290Module)
      },
      {
        path: 'company',
        loadChildren: () => import('./company/company.module').then((a) => a.CompanyModule),
      },
      {
        path: 'communicator',
        loadChildren: () =>
          import('./communicator/communicator.module').then((a) => a.CommunicatorModule),
      },
      {
        path: 'tools/calendar',
        loadChildren: () => import('./calendar/calendar.module').then((a) => a.CalendarModule),
      },
      {
        path: 'tools/contacts',
        loadChildren: () => import('./contact/contact.module').then((a) => a.ContactModule),
      },
      {
        path: 'accounting',
        loadChildren: () =>
          import('./accounting/accounting.module').then((a) => a.AccountingModule),
      },
      {
        path: 'tools/accounts',
        loadChildren: () => import('./accounts/accounts.module').then((a) => a.AccountsModule),
      },
      {
        path: 'owners',
        loadChildren: () => import('./owners/owners.module').then((a) => a.OwnersModule),
      },
      {
        path: 'tools/reports',
        loadChildren: () => import('./reports/reports.module').then((a) => a.ReportsModule),
      },
      {
        path: 'signalr/testgps',
        loadChildren: () => import('./testgps/testgps.module').then((a) => a.TestgpsModule),
      },
      {
        path: 'tools/reportsold',
        loadChildren: () =>
          import('./reportsold/reportsold.module').then((a) => a.ReportsoldModule),
      },
      // { path: 'tools/reports', component: ReportsComponent, data: { title: 'Reports' } },
      {
        path: 'tools/mvr',
        loadChildren: () => import('./mvr/mvr.module').then((a) => a.MvrModule),
      },
      {
        path: 'tools/statistics',
        component: AppNoPageFoundComponent,
        data: { title: 'Statistics' },
      },
      { path: 'tools/factoring', component: TaCardComponent, data: { title: 'Factoring' } },
      // Repair shop
      {
        path: 'map-view',
        component: ShopMapComponent,
        data: { title: 'Map View' },
      },
      // IFTA
      { path: 'ifta', component: AppNoPageFoundComponent, data: { title: 'Ifta' } },
      // Miles
      { path: 'tools/miles', component: AppNoPageFoundComponent, data: { title: 'Miles' } },
      // Accounting
      { path: 'payroll', component: AppNoPageFoundComponent, data: { title: 'Payroll' } },
      { path: 'deductions', component: AppNoPageFoundComponent, data: { title: 'Deductions' } },
      { path: 'credits', component: AppNoPageFoundComponent, data: { title: 'Credits' } },
      { path: 'expenses', component: AppNoPageFoundComponent, data: { title: 'Expenses' } },
      // Reports
      { path: 'stats', component: AppNoPageFoundComponent, data: { title: 'Stats' } },
      {
        path: 'safety/roadside',
        component: AppNoPageFoundComponent,
        data: { title: 'Roadside inspections' },
      },
      {
        path: 'statistic',
        loadChildren: () => import('./statistic/statistic.module').then((a) => a.StatisticModule),
      },
    ],
  },
  // Applicant
  {
    path: 'applicant',
    loadChildren: () => import('./applicant/applicant.module').then((a) => a.ApplicantModule),
  },
  // Authentication
  {
    path: 'login',
    loadChildren: () =>
      import('./core/authentication/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./core/authentication/register/register.module').then((a) => a.RegisterModule),
  },
  { path: 'reset-password', component: ResetPasswordComponent, data: { title: 'Reset password' } },
  {
    path: 'user',
    loadChildren: () =>
      import('./core/authentication/verify/verify.module').then((a) => a.VerifyModule),
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
