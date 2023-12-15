import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  private URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  scheduleEvent(): Observable<any>{
    return this.http.get<any>(`${this.URL}/schedule_event`);
  }

}
