import {Injectable} from '@angular/core';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import * as moment from 'moment';

export interface Task {
  id?: string
  title: string
  date?: string
}

export interface CreateResponce {
  name: string
}

@Injectable({
  providedIn: 'root'
})

export class TasksService {
  static url = 'https://angular-practice-calenda-769df.firebaseio.com/tasks';

  constructor(private http: HttpClient) {
  }

  load(date: moment.Moment): Observable<Task[]> {
    return this.http.get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map(tasks => {
        if(!tasks){
          return[];
        } else {
          return Object.keys(tasks).map(key=>({...tasks[key], id: key}));
        }
      }))
  }

  create(task: Task): Observable<Task> {
    return this.http.post<CreateResponce>(`${TasksService.url}/${task.date}.json`, task)
      .pipe(map( res=> {
        return {...task, id: res.name};
      }))
  }

  remove(task: Task): Observable<any> {
    return this.http.delete<any>(`${TasksService.url}/${task.date}/${task.id}.json`);
  }
}

