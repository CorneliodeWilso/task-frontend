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
/**
 * Task Form Component
 * Description: Component responsible to show a form where the user create or update the tasks
 * @date 2026-02-05
 * @author Cornelio Leal
 */
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
    private taskService: TaskService,
    private utils: UtilsService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
  ) {}


  /**
   * Description: Life cicle of the component, iniside we get the id from the url to determinate if is update o create a task
   * and generate the task form
   */
  ngOnInit() {
    this.taskId = this.route.snapshot.paramMap.get('id');
    if (this.taskId) {
      this.isEditMode = true;
      this.getTaskById(this.taskId);
    }
    this.taskFormBuilder();
  }


  /**
   * Description: Function to build the reactive form taskForm with her properties and validations
   */
  taskFormBuilder() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', Validators.required],
      completed: [false],
    });
  }

   /**
   * Description: The function responsible for creating a task;
   *  if the form is invalid, nothing is done; if the form is correct, 
   * the user is asked if they are sure, and based on their answer, 
   * the record is created or updated.
   */
  createTask() {
    if (this.taskForm.invalid) return;

    this.utils
      .openConfirmDialog(this.isEditMode ? '¿Estás seguro de actualizar la tarea?' : '¿Estás seguro de crear la tarea?')
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.utils.showLoading();
        const task = this.taskForm.value;
        if (this.isEditMode && this.taskId) {
          this.taskService.updateTask(this.taskId, task).subscribe(() => {
            this.utils.openSnackBar('Tarea actualizada');
            this.router.navigate(['/tasks']);
          });
        } else {
          this.taskService.createTask(task).subscribe({
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

   /**
   * Description: The function responsible for get a task by id, when the is found her properties are showed in the formulary
   * @param {string} taskId
   * @return all values of the task in the formulary to update
   */
  getTaskById(taskId: string) {
    this.taskService.getTaskById(taskId).subscribe({
      next: (task: Task) => {
        this.taskForm.patchValue({
          title: task.title,
          description: task.description,
          completed: task.completed,
        });
      },
    });
  }

    /**
   * Description: redirect the user to the task list
   */
  cancel() {
    this.router.navigate(['/tasks']);
  }
}
