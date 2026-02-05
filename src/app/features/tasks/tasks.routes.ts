import { Routes } from '@angular/router';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { TaskFormComponent } from './pages/task-form/task-form.component';

export const TASKS_ROUTES: Routes = [

  {
    path: '',
    component: TaskListComponent
  },
  {
    path: 'create',
    component: TaskFormComponent
  },
  {
    path: 'edit/:id',
    component: TaskFormComponent
  }
];