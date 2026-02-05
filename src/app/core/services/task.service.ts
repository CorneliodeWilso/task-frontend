import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Task } from '../../features/tasks/models/task.interface';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
   private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTasks():Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`);
  }

  getTaskById(taskId: string):Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/tasks/${taskId}`);
  }

  createTask(task: Task) {
    return this.http.post(`${this.apiUrl}/tasks`, task);
  }

  updateTask(id: string, task: Task) {
    return this.http.put(`${this.apiUrl}/tasks/${id}`, task);
  }

  deleteTask(id: string) {
    return this.http.delete(`${this.apiUrl}/tasks/${id}`);
  }
}
