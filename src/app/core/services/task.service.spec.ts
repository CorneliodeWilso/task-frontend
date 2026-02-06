import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TaskService } from './task.service';
import { environment } from '../../../environments/environment';
import { Task } from '../../features/tasks/models/task.interface';
import { ResponseModel } from '../models/ResponseModel';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  const apiUrl = environment.apiUrl;

  const mockTask: Task = {
    id: '11639a89-17a8-422f-9066-58dea259cf9f',
    title: 'Task',
    description: 'Description',
    completed: false,
    createdAt: '2026-02-06T15:41:00.000Z',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('retrieve all tasks', () => {
    const mockResponse: ResponseModel = {
      code: 200,
      data: [mockTask],
      message: 'Tasks retrieved',
    };

    service.getTasks().subscribe((tasks) => {
      expect(tasks.length).toBe(1);
      expect(tasks).toEqual([mockTask]);
    });

    const req = httpMock.expectOne(`${apiUrl}/tasks`);
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('return empty array if no tasks are returned', () => {
    const mockResponse: ResponseModel = {
      code: 404,
      data: null,
      message: 'Tasks not found',
    };

    service.getTasks().subscribe((tasks) => {
      expect(tasks).toEqual([]);
    });

    const req = httpMock.expectOne(`${apiUrl}/tasks`);
    req.flush(mockResponse);
  });

  it('get a task by id', () => {
    const mockResponse: ResponseModel = {
      code: 200,
      data: mockTask,
      message: 'Success',
    };

    service.getTaskById('11639a89-17a8-422f-9066-58dea259cf9f').subscribe((task) => {
      expect(task).toEqual(mockTask);
    });

    const req = httpMock.expectOne(
      `${apiUrl}/tasks/11639a89-17a8-422f-9066-58dea259cf9f`,
    );
    expect(req.request.method).toBe('GET');

    req.flush(mockResponse);
  });

  it('return empty object when tas not found', () => {
    const mockResponse: ResponseModel = {
      code: 404,
      data: null,
      message: 'Task not found',
    };

    service
      .getTaskById('11639a89-17a8-422f-9066-58dea259cf9f')
      .subscribe((task) => {
        expect(task).toEqual({});
      });

    const req = httpMock.expectOne(
      `${apiUrl}/tasks/11639a89-17a8-422f-9066-58dea259cf9f`,
    );
    req.flush(mockResponse);
  });

  it('create a task', () => {
    const newTask: Task = {
      id: '11639a89-17a8-422f-9066-58dea259cf9f',
      title: 'Task 1',
      description: 'Description 1',
      completed: false,
      createdAt: '2026-02-05T15:41:00.000Z',
    };

    const mockResponse: ResponseModel = {
      code: 200,
      data: newTask,
      message: 'Success',
    };

    service.createTask(newTask).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/tasks`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newTask);

    req.flush(mockResponse);
  });

  it('update a task', () => {
    const updatedTask: Task = {
      id: '11639a89-17a8-422f-9066-58dea259cf9f',
      title: 'Task updated',
      description: 'Description updated',
      completed: true,
      createdAt: '2026-02-06T15:41:00.000Z',
    };

    const mockResponse: ResponseModel = {
      code: 200,
      data: updatedTask,
      message: 'Success',
    };

    service.updateTask('11639a89-17a8-422f-9066-58dea259cf9f', updatedTask).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/tasks/11639a89-17a8-422f-9066-58dea259cf9f`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedTask);

    req.flush(mockResponse);
  });


  it('delete a task', () => {
    const mockResponse: ResponseModel = {
      code: 200,
      data: null,
      message: 'Success',
    };

    service.deleteTask('11639a89-17a8-422f-9066-58dea259cf9f').subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/tasks/11639a89-17a8-422f-9066-58dea259cf9f`);
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });
});
