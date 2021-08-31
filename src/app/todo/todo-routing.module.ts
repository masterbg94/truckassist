import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppTodoListComponent } from './app-todo-list/app-todo-list.component';

const routes: Routes = [
  { path: '', component: AppTodoListComponent, data: { title: 'Todo list' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoRoutingModule {}
