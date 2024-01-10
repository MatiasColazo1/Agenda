import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NombreService {

  /* private URL = 'https://back-agenda.onrender.com/api'; */
  private URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getUserDetails(): Observable<any> {
    return this.http.get(`${this.URL}/private`);
  }
}
