import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { Task } from '../../features/tasks/models/task.interface';
import { ResponseModel } from '../models/ResponseModel';
/**
 * Task Service
 * Description: Handles tasks operations
 * @date: 2026-02-05
 * @author: Cornelio Leal
 * @service
 */
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

   /**
   * Description: Retrieve all the tasks 
   * @returns Observable with an array that contains all the tasks
   * @method GET
   */
  getTasks(): Observable<Task[]> {
    return this.http
      .get<ResponseModel>(`${this.apiUrl}/tasks`)
      .pipe(map((response) => response.data ?? []));
  }

  /**
   * Description: Retrieve only one task, 
   * @param {string} taskId 
   * @returns Observable with an objet that contains only one task
   * @method GET
   */
  getTaskById(taskId: string): Observable<Task> {
    return this.http.get<ResponseModel>(`${this.apiUrl}/tasks/${taskId}`).pipe(
      map(response => response.data ?? {})
    );
  }

  /**
   * Description: Responsible to create a Task
   * @param {Task} task 
   * @returns an observable that contains the response of the operation after creating a task
   * @method POST
   */
  createTask(task: Task): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(`${this.apiUrl}/tasks`, task);
  }

   /**
   * Description: Responsible to update the informacion of the task
   * @param {string} id 
   * @param {Task} task 
   * @returns an observable that contains the response of the operation after UPDATE a task
   * @method PUT
   */
  updateTask(id: string, task: Task): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(`${this.apiUrl}/tasks/${id}`, task);
  }

    /**
   * Description: Responsible to delete a task
   * @param {string} id 
   * @returns an observable that contains the response of the operation after DELETE a task
   * @method DELETE
   */
  deleteTask(id: string): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(`${this.apiUrl}/tasks/${id}`);
  }
}
