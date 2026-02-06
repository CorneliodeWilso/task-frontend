import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormComponent } from './task-form.component';
import { TaskService } from '../../../../core/services/task.service';
import { UtilsService } from '../../../../core/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task.interface';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  let taskService: jest.Mocked<TaskService>;
  let utilsService: jest.Mocked<UtilsService>;
  let router: Router;

  const mockTask: Task = {
    id: '1',
    title: 'Task1',
    description: 'Task1 description',
    completed: false,
    createdAt: '2026-02-06T15:41:00.000Z'
  };

  beforeEach(async () => {
    const taskServiceMock = {
      getTaskById: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
    };

    const utilsServiceMock = {
      openConfirmDialog: jest.fn(),
      showLoading: jest.fn(),
      hideLoading: jest.fn(),
      openSnackBar: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        TaskFormComponent,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: UtilsService, useValue: utilsServiceMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: jest.fn(),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;

    taskService = TestBed.inject(TaskService) as jest.Mocked<TaskService>;
    utilsService = TestBed.inject(UtilsService) as jest.Mocked<UtilsService>;
    router = TestBed.inject(Router);

    jest.spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initialize in create mode', () => {
    component.ngOnInit();

    expect(component.isEditMode).toBe(false);
    expect(component.taskForm).toBeDefined();
  });

  it('initialize in edit mode ', () => {
    const route = TestBed.inject(ActivatedRoute) as any;
    route.snapshot.paramMap.get.mockReturnValue('1');
    taskService.getTaskById.mockReturnValue(of(mockTask));

    component.ngOnInit();

    expect(component.isEditMode).toBe(true);
    expect(taskService.getTaskById).toHaveBeenCalledWith('1');
  });


  it('mark form as invalid when empty', () => {
    component.ngOnInit();

    component.taskForm.setValue({
      title: '',
      description: '',
      completed: false,
    });

    expect(component.taskForm.invalid).toBe(true);
  });


  it('create a task when confirmed button is pressed', () => {
    component.ngOnInit();
    utilsService.openConfirmDialog.mockReturnValue(of(true));
    taskService.createTask.mockReturnValue(of({} as any));

    component.taskForm.setValue({
      title: 'Desayunar',
      description: 'Desayunar cereales',
      completed: false,
    });

    component.createTask();

    expect(utilsService.openConfirmDialog).toHaveBeenCalled();
    expect(utilsService.showLoading).toHaveBeenCalled();
    expect(taskService.createTask).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('not create task if cancel button is pressed', () => {
    component.ngOnInit();
    utilsService.openConfirmDialog.mockReturnValue(of(false));

    component.createTask();

    expect(taskService.createTask).not.toHaveBeenCalled();
  });

  it('show error in snackbar when create task fail', () => {
    component.ngOnInit();
    utilsService.openConfirmDialog.mockReturnValue(of(true));
    taskService.createTask.mockReturnValue(
      throwError(() => new Error('Create error'))
    );

    component.taskForm.setValue({
      title: 'Desayuno',
      description: 'Desayunar cereales',
      completed: false,
    });

    component.createTask();

    expect(utilsService.hideLoading).toHaveBeenCalled();
    expect(utilsService.openSnackBar).toHaveBeenCalledWith(
      'Ha ocurrido un error al guardar la tarea'
    );
  });



  it('update task when in edit mode', () => {
    const route = TestBed.inject(ActivatedRoute) as any;
    route.snapshot.paramMap.get.mockReturnValue('1');
    taskService.getTaskById.mockReturnValue(of(mockTask));
    utilsService.openConfirmDialog.mockReturnValue(of(true));
    taskService.updateTask.mockReturnValue(of({} as any));

    component.ngOnInit();

    component.taskForm.setValue({
      title: 'Desayunar editado',
      description: 'Desayunar cereales',
      completed: true,
    });

    component.createTask();

    expect(taskService.updateTask).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        title: 'Desayunar editado',
        description: 'Desayunar cereales',
        completed: true,
      })
    );
    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });


  it('navigate back to tasks on cancel button pressed', () => {
    component.cancel();

    expect(router.navigate).toHaveBeenCalledWith(['/tasks']);
  });
});
