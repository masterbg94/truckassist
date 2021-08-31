import { NgModule } from '@angular/core';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register.routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { ThankYouComponent } from './thank-you-page/thank-you.component';
import { ActivatedComponent } from './activated-page/activated.component';

@NgModule({
  declarations: [
    RegisterComponent,
    ThankYouComponent,
    ActivatedComponent
  ],
  imports: [
    RegisterRoutingModule,
    SharedModule
  ]
})
export class RegisterModule {
}
