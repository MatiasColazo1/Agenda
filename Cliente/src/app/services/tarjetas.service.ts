import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarjetasService {
private URL='http://localhost:3000/api';

  constructor(private http:HttpClient) { }


  getTarjeta():Observable<any>{
    return this.http.get<any>(`${this.URL}/tarjeta`)
  }

  postTarjeta(tarjeta: any):Observable<any>{
    return this.http.post<any>(`${this.URL}/tarjeta`, tarjeta)
  }
}
