import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {LoginComponent} from './login.component';

const ROUTES: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {title: 'Login'},
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: {title: 'Forgot password'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
}
