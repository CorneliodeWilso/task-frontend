import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UtilsService } from '../../../../core/services/utils.service';
import { TaskService } from '../../../../core/services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Task } from '../../models/task.interface';

@Component({
  selector: 'app-task-form',
  imports: [SharedModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss',
})
export class TaskFormComponent {
  taskId: string | null = null;
  isEditMode = false;
  titleForm: string;
  taskForm: FormGroup;
  constructor(
    private TaskService: TaskService,
    private utils: UtilsService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEditMode = true;
      this.getTaskById(this.taskId);
    }
    this.taskFormBuilder();
  }

  taskFormBuilder() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', Validators.required],
      completed: [false],
    });
  }

  createTask() {
    if (this.taskForm.invalid) return;

    this.utils
      .openConfirmDialog(this.isEditMode ? '¿Estás seguro de actualizar la tarea?' : '¿Estás seguro de crear la tarea?')
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.utils.showLoading();
        const task = this.taskForm.value;
        if (this.isEditMode && this.taskId) {
          this.TaskService.updateTask(this.taskId, task).subscribe(() => {
            this.utils.openSnackBar('Tarea actualizada');
            this.router.navigate(['/tasks']);
          });
        } else {
          this.TaskService.createTask(task).subscribe({
            next: (resp) => {
              this.router.navigate(['/tasks']);
            },
            error: (error) => {
              this.utils.hideLoading();
              this.utils.openSnackBar(
                'Ha ocurrido un error al guardar la tarea',
              );
            },
          });
        }
      });
  }

  getTaskById(taskId: string) {
    this.TaskService.getTaskById(taskId).subscribe({
      next: (task: Task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          completed: task.completed,
        });
      },
    });
  }
  cancel() {
    this.router.navigate(['/tasks']);
  }
}
