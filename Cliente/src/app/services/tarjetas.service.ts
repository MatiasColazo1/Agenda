import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarjetasService {
private URL='https://back-agenda.onrender.com/api';

  constructor(private http:HttpClient) { }


  getTarjeta():Observable<any>{
    return this.http.get<any>(`${this.URL}/tarjeta`)
  }

  postTarjeta(tarjeta: any):Observable<any>{
    return this.http.post<any>(`${this.URL}/tarjeta`, tarjeta)
  }

  deleteTarjeta(id: string): Observable<any> {
    return this.http.delete<any>(`${this.URL}/tarjeta/${id}`)
  }

  putTarjeta(id: string, tarjeta: any): Observable<any> {
    return this.http.put<any>(`${this.URL}/tarjeta/${id}`, tarjeta)
  }
}
