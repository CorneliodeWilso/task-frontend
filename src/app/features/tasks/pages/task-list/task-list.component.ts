import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { Task } from '../../models/task.interface';
import { TaskService } from '../../../../core/services/task.service';
import { UtilsService } from '../../../../core/services/utils.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
/**
 * Task List Component
 * Description: Component responsible to show the list of tasks
 * @date 2026-02-05
 * @author Cornelio Leal
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [SharedModule, DatePipe, MatTableModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements AfterViewInit {
  /**
 * Description: Columns to show in the table
 */
  displayedColumns: string[] = [
    'title',
    'description',
    'completed',
    'createdAt',
    'actions',
  ];
  dataSource = new MatTableDataSource<Task>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private taskService: TaskService,
    private utils: UtilsService,
    private router: Router,
  ) {}


  /**
   * Description: Life cicle of the component, iniside we get thall tasks to list in the table and set the values to filter
   */
  ngOnInit() {
    this.dataSource.filterPredicate = (task: Task, filter: string) => {
      const searchText = filter.toLowerCase();

      return (
        task.title.toLowerCase().includes(searchText) ||
        task.description?.toLowerCase().includes(searchText)
      );
    };
    this.getAllTasks();
  }

   /**
   * Description: Life cicle of the component, iniside we configure the paginator of the table and the sort method
   */
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.sort.active = 'createdAt';
    this.sort.direction = 'desc';
    this.sort.sortChange.emit({
      active: 'createdAt',
      direction: 'desc',
    });
  }

  /**
   * Description: The function responsible to get all the tasks usint the Task service to show in the list
   */
  getAllTasks() {
    this.utils.showLoading();
    this.taskService.getTasks().subscribe({
      next: (tasks: Task[]) => {
        this.dataSource.data = tasks;
        this.utils.hideLoading();
      },
      error: (error) => {
        this.utils.hideLoading();
        this.utils.openSnackBar(
          'Ha ocurrido un error al obtener la lista de tareas',
        );
      },
    });
  }

  /**
   * Description: The function responsible delete a task, when the process is successfully we call the list of the tasks
   * @param {string} taskId
   */
  deleteTask(taskId: string) {
    this.utils
      .openConfirmDialog('¿Estás seguro de eliminar esta tarea?')
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.utils.showLoading();
        this.taskService.deleteTask(taskId).subscribe({
          next: (resp) => {
            this.utils.openSnackBar("Tarea eliminada con exito")
            this.getAllTasks();
          },
          error: (error) => {
            this.utils.hideLoading();
            this.utils.openSnackBar(
              'Ha ocurrido un error al eliminar la tarea',
            );
          },
        });
      });
  }

  /**
   * Description: When the user select the button to Create a task we redirect this to the create form
   */
  createTask() {
    this.router.navigate(['/tasks/create']);
  }

  /**
   * Description: When the user select the option to edit task we redirect this to the edit form
   * @param {string} taskId
   */
  editTask(taskId: string) {
    this.router.navigate(['/tasks/edit', taskId]);
  }


   /**
   * Description: Responsible to update a task when the user clicken in a checkbox to complete a task
   * @param {task} task
   * @param {boolean} completed
   */
  completeTask(task: Task, completed: boolean) {
    if (task.completed === completed) return;
    const updatedTask = {
      ...task,
      completed,
    };

    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        task.completed = completed;
        this.utils.openSnackBar(
          completed ? 'Tarea completada' : 'Tarea marcada como pendiente',
        );
      },
      error: () => {
        this.utils.openSnackBar('Error al actualizar la tarea');
      },
    });
  }

   /**
   * Description: Responsible to filter the register on the table
   * @param {Event} event
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

 
}
