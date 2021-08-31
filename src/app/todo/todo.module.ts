import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoRoutingModule } from './todo-routing.module';
import { AppTodoListComponent } from './app-todo-list/app-todo-list.component';
import { SharedModule } from '../shared/shared.module';
import { AppTodoListCardComponent } from './app-todo-list/app-todo-list-card/app-todo-list-card.component';
import { TodoManageComponent } from './todo-manage/todo-manage.component';

@NgModule({
  declarations: [
    AppTodoListComponent,
    AppTodoListCardComponent,
    TodoManageComponent,
  ],
  imports: [CommonModule, TodoRoutingModule, SharedModule],
  entryComponents: [],
})
export class TodoModule {}
