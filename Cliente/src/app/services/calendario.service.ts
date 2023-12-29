import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {
  private URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

 
  obtenerEventos(): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.URL}/calendario`);
  }

  getEvents(start: string, end: string): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.URL}?start=${start}&end=${end}`);
  }

  crearEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.URL}/calendario`, evento);
  }

  actualizarEvento(evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.URL}/calendario/${evento._id}`, evento);
  }

  eliminarEvento(_id: string): Observable<any> {
    return this.http.delete(`${this.URL}/calendario/${_id}`);
  }
}

export interface Evento {
  _id?: string;
  title: string;
  start: string;
  end?: string;
  allDay: boolean;
}