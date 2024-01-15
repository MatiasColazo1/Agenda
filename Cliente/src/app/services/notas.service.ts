import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

/*  private URL = 'http://localhost:3000/api'; */
 private URL = 'https://back-agenda.onrender.com/api'


  constructor(private http: HttpClient) { }

  getNota(): Observable<any> {
    return this.http.get<any>(`${this.URL}/nota`)
  }

  postNota(contenido: String): Observable<any> {
    return this.http.post<any>(`${this.URL}/nota`, { contenido })
  }

  putNota(id: string, nota: { contenido: string }): Observable<any> {
    return this.http.put<any>(`${this.URL}/nota/${id}`, nota);
  }
}
