import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskService } from '../../../../core/services/task.service';
import { UtilsService } from '../../../../core/services/utils.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Task } from '../../models/task.interface';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ResponseModel } from '../../../../core/models/ResponseModel';
const mockResponse: ResponseModel = {
  code: 200,
  data: {
    token: 'token123',
  },
  message: 'success',
};
describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  let taskService: jest.Mocked<TaskService>;
  let utilsService: jest.Mocked<UtilsService>;
  let router: jest.Mocked<Router>;

  const mockTasks: Task[] = [
    {
      id: '1234',
      title: 'Tarea1',
      description: 'Descripcion1',
      completed: false,
      createdAt: '2026-02-06T15:41:00.000Z',
    },
    {
      id: '12345',
      title: 'Tarea2',
      description: 'Cescripcion2',
      completed: false,
      createdAt: '2026-02-06T15:41:00.000Z',
    },
    {
      id: '123456',
      title: 'Tarea3',
      description: 'Cescripcion3',
      completed: true,
      createdAt: '2026-02-06T15:41:00.000Z',
    },
  ];

  beforeEach(async () => {
    const taskServiceMock = {
      getTasks: jest.fn(),
      deleteTask: jest.fn(),
      updateTask: jest.fn(),
    };

    const utilsServiceMock = {
      showLoading: jest.fn(),
      hideLoading: jest.fn(),
      openSnackBar: jest.fn(),
      openConfirmDialog: jest.fn(),
    };

    const routerMock = {
      navigate: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        TaskListComponent,
        NoopAnimationsModule, 
      ],
      providers: [
        { provide: TaskService, useValue: taskServiceMock },
        { provide: UtilsService, useValue: utilsServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;

    taskService = TestBed.inject(TaskService) as jest.Mocked<TaskService>;
    utilsService = TestBed.inject(UtilsService) as jest.Mocked<UtilsService>;
    router = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('load tasks list on init method', () => {
    taskService.getTasks.mockReturnValue(of(mockTasks));

    component.ngOnInit();

    expect(utilsService.showLoading).toHaveBeenCalled();
    expect(taskService.getTasks).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockTasks);
    expect(utilsService.hideLoading).toHaveBeenCalled();
  });

  it('show snackbar when getTasks fails', () => {
    taskService.getTasks.mockReturnValue(
      throwError(() => new Error('Error'))
    );

    component.getAllTasks();

    expect(utilsService.showLoading).toHaveBeenCalled();
    expect(utilsService.hideLoading).toHaveBeenCalled();
    expect(utilsService.openSnackBar).toHaveBeenCalledWith(
      'Ha ocurrido un error al obtener la lista de tareas'
    );
  });


  it('delete task when confirmed button pressed', () => {
    taskService.deleteTask.mockReturnValue(of(mockResponse));
    taskService.getTasks.mockReturnValue(of(mockTasks));
    utilsService.openConfirmDialog.mockReturnValue(of(true));

    component.deleteTask('1');

    expect(utilsService.openConfirmDialog).toHaveBeenCalled();
    expect(utilsService.showLoading).toHaveBeenCalled();
    expect(taskService.deleteTask).toHaveBeenCalledWith('1');
  });

  it('Cancel delete task', () => {
    utilsService.openConfirmDialog.mockReturnValue(of(false));

    component.deleteTask('1');

    expect(taskService.deleteTask).not.toHaveBeenCalled();
  });

  it('show error in snackbar if delete task fail', () => {
    utilsService.openConfirmDialog.mockReturnValue(of(true));
    taskService.deleteTask.mockReturnValue(
      throwError(() => new Error('Delete error'))
    );

    component.deleteTask('1');

    expect(utilsService.hideLoading).toHaveBeenCalled();
    expect(utilsService.openSnackBar).toHaveBeenCalledWith(
      'Ha ocurrido un error al eliminar la tarea'
    );
  });


  it('navigate to create task form', () => {
    component.createTask();

    expect(router.navigate).toHaveBeenCalledWith(['/tasks/create']);
  });

  it('navigate to edit task form', () => {
    component.editTask('123');

    expect(router.navigate).toHaveBeenCalledWith(['/tasks/edit', '123']);
  });

  it('update task when completed checkbox is pressed', () => {
    const task = { ...mockTasks[0] };
    taskService.updateTask.mockReturnValue(of(mockResponse));

    component.completeTask(task, true);

    expect(taskService.updateTask).toHaveBeenCalled();
    expect(task.completed).toBe(true);
    expect(utilsService.openSnackBar).toHaveBeenCalledWith('Tarea completada');
  });

  it('not call update if completed state does not change', () => {
    const task = { ...mockTasks[2] };

    component.completeTask(task, true);

    expect(taskService.updateTask).not.toHaveBeenCalled();
  });

  it('show error in snackbar if update task fails', () => {
    const task = { ...mockTasks[0] };
    taskService.updateTask.mockReturnValue(
      throwError(() => new Error('Update error'))
    );

    component.completeTask(task, true);

    expect(utilsService.openSnackBar).toHaveBeenCalledWith(
      'Error al actualizar la tarea'
    );
  });


  it('apply filter to datasource to show in the table', () => {
    const event = {
      target: { value: 'task 1' },
    } as unknown as Event;

    component.applyFilter(event);

    expect(component.dataSource.filter).toBe('task 1');
  });
});