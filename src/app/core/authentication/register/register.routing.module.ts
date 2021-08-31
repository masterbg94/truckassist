import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register.component';
import { ThankYouComponent } from './thank-you-page/thank-you.component';
import { ActivatedComponent } from './activated-page/activated.component';

const Routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
    data: { title: 'Registration' }
  },
  {
    path: 'thanks',
    component: ThankYouComponent,
    data: { title: 'Thank you' },
  },
  {
    path: 'activated',
    component: ActivatedComponent,
    data: { title: 'Activated' },
  }
];

@NgModule({
  imports: [RouterModule.forChild(Routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule {

}
