import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareasService {

  private URL='https://back-agenda.onrender.com/api';

  constructor(private http:HttpClient) { }

  getTarea():Observable<any>{
    return this.http.get<any>(`${this.URL}/tarea`)
  }

  postTarea(tarea: any):Observable<any>{
    return this.http.post<any>(`${this.URL}/tarea`, tarea)
  }

  deleteTarea(id: string): Observable<any> {
    return this.http.delete<any>(`${this.URL}/tarea/${id}`)
  }

  putTarea(id: string, tarea: any): Observable<any> {
    return this.http.put<any>(`${this.URL}/tarea/${id}`, tarea);
}
}
