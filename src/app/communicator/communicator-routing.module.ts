import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunicatorComponent } from './communicator.component';

const routes: Routes = [
  {
    path: '',
    component: CommunicatorComponent,
    data: { title: 'Communicator' },
    children: [
      {
        path: ':id',
        component: CommunicatorComponent
      },
      {
        path: ':id/subchats/:subchatId',
        component: CommunicatorComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunicatorRoutingModule {
}
