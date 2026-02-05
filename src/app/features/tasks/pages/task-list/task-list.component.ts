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
MatTableModule
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [SharedModule, DatePipe, MatTableModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
})
export class TaskListComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'title',
    'description',
    'completed',
    'createdAt',
    'actions',
  ];
  tasks: Task[] = [];
  dataSource = new MatTableDataSource<Task>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private TaskService: TaskService,
    private utils: UtilsService,
    private router: Router,
  ) {}

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
  getAllTasks() {
    this.utils.showLoading();
    this.TaskService.getTasks().subscribe({
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
  deleteTask(taskId: string) {
    this.utils
      .openConfirmDialog('¿Estás seguro de eliminar esta tarea?')
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.utils.showLoading();
        this.TaskService.deleteTask(taskId).subscribe({
          next: (resp) => {
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

  createTask() {
    this.router.navigate(['/tasks/create']);
  }

  editTask(taskId: string) {
    this.router.navigate(['/tasks/edit', taskId]);
  }

  completeTask(task: Task, completed: boolean) {
    if (task.completed === completed) return;
    const updatedTask = {
      ...task,
      completed,
    };

    this.TaskService.updateTask(task.id, updatedTask).subscribe({
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
