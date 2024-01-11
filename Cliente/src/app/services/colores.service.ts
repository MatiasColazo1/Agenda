import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ColoresService {
  private colorSource = new BehaviorSubject<string>('default');
  currentColor = this.colorSource.asObservable();
  
  private backgroundColorSource = new BehaviorSubject<string>('defaultBackground');
  currentBackgroundColor = this.backgroundColorSource.asObservable();

  private apiUrl = 'http://localhost:3000/api/private'; // Asegúrate de que esta URL sea correcta

  constructor(private http: HttpClient) { }

  cambiarColor(color: string) {
    this.colorSource.next(color);
    this.backgroundColorSource.next(color + 'Background');
    this.updateColorUser(color); // Actualizar el color en el backend
  }

  updateColorUser(color: string) {
    // Asegúrate de enviar el token de autenticación si es necesario
    return this.http.put(this.apiUrl, { colorUser: color }).subscribe(
      response => {
        console.log('Color actualizado con éxito', response);
      },
      error => {
        console.error('Error al actualizar el color', error);
      }
    );
  }
}