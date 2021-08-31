import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {VerifyPasswordComponent} from './verify-password/verify-password.component';
import {UserVerifyComponent} from './user-verify/user-verify.component';
import {CheckPasswordResetComponent} from './password-reset/check-password-reset.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';

const Routes: Routes = [
  {
    path: 'set/password/start/:hashedUsername/:id',
    component: VerifyPasswordComponent,
    data: {title: 'Verify password'},
  },
  {
    path: 'verify/:hashedUsername/:code',
    component: UserVerifyComponent,
    data: {title: 'Verify user'},
  },
  {
    path: 'password/request/:hashedUsername/:code',
    component: CheckPasswordResetComponent,
    data: {title: 'Check user-password'},
  },
  {
    path: 'password/reset',
    component: PasswordResetComponent,
    data: {title: 'Password reset'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(Routes)],
  exports: [RouterModule]
})
export class VerifyRoutingModule {
}
