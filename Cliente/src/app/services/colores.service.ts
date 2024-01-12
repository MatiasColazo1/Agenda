import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ColoresService {
;
  private colorSource = new BehaviorSubject<string>(this.getColorFromLocalStorage() || 'default');
  currentColor = this.colorSource.asObservable();
  
  private backgroundColorSource = new BehaviorSubject<string>('defaultBackground');
  currentBackgroundColor = this.backgroundColorSource.asObservable();

  private apiUrl = 'http://localhost:3000/api/private'; 


  constructor(private http: HttpClient) { }

  cambiarColor(color: string) {
    localStorage.setItem('userColor', color);
    this.colorSource.next(color);
    this.backgroundColorSource.next(color + 'Background');
    this.updateColorUser(color); // Actualizar el color en el backend
  }

  getColorFromLocalStorage(): string | null {
    return localStorage.getItem('userColor');
  }


  updateColorUser(color: string) {
    // Primera llamada HTTP usando apiUrl
    this.http.put(this.apiUrl, { colorUser: color }).subscribe(
      response => {
        console.log('Color actualizado con éxito en apiUrl', response);
      },
      error => {
        console.error('Error al actualizar el color en apiUrl', error);
      }
    );
  }
}