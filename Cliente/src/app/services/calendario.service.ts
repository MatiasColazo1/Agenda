import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  /* private URL = 'https://back-agenda.onrender.com/api'; */
private URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

 
  createEventCalendar(data: any): Observable<any> {
    return this.http.post(`${this.URL}/calendario`, data);
  }

  getAllEventsCalendar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/calendario`);
  }

  updateEventCalendar(data: any): Observable<any> {
    return this.http.put(`${this.URL}/calendario`, data);
  }

  deleteEventCalendar(id: string): Observable<any> {
    return this.http.delete(`${this.URL}/calendario/${id}`);
  }
}
