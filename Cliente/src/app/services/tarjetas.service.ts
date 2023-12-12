import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';

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

  deleteTarjeta(id: string): Observable<any> {
    return this.http.delete<any>(`${this.URL}/tarjeta/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar tarjeta: ', error);
        throw error; // Re-lanza el error para que se propague a la suscripción en el componente.
      })
    );
  }
}
