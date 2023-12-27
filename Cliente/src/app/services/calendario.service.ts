import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  private URL = 'http://localhost:3000/api/calendario';

  constructor(private http: HttpClient) { }

 
  obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.URL);
  }

  crearEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.URL, evento);
  }

  actualizarEvento(evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.URL}/${evento._id}`, evento);
  }

  eliminarEvento(id: string): Observable<any> {
    return this.http.delete(`${this.URL}/${id}`);
  }
}

export interface Evento {
  _id?: string;
  titulo: string;
  inicio: string;
  fin: string;
  usuario?: string;
  allDay: boolean
}