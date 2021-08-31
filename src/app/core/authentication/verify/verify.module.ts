import {NgModule} from '@angular/core';

import {VerifyRoutingModule} from './verify.routing.module';
import {UserVerifyComponent} from './user-verify/user-verify.component';
import {VerifyPasswordComponent} from './verify-password/verify-password.component';
import {SharedModule} from '../../../shared/shared.module';
import {CheckPasswordResetComponent} from './password-reset/check-password-reset.component';
import {PasswordResetComponent} from './password-reset/password-reset.component';

@NgModule({
  declarations: [
    UserVerifyComponent,
    VerifyPasswordComponent,
    CheckPasswordResetComponent,
    PasswordResetComponent
  ],
  imports: [VerifyRoutingModule, SharedModule],
})
export class VerifyModule {
}
