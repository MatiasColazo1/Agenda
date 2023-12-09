import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor( private toastrService: ToastrService) { }
    
  msjError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Error de red o cliente
      this.toastrService.error('Error de red o cliente. Por favor, inténtelo de nuevo.', 'Error');
    } else if (error.status === 401) {
      // Manejar el código de estado 401 (no autorizado)
      this.toastrService.error('Usuario no autorizado. Por favor, inicie sesión.', 'Error');
    } else if (error.status === 403) {
      // Manejar el código de estado 403 (prohibido)
      this.toastrService.error('Acceso prohibido. Por favor, verifique sus credenciales.', 'Error');
    } else if (error.error && error.error.msg) {
      // Manejar otros errores definidos en el servidor
      this.toastrService.error(error.error.msg, 'Error');
    } else {
      // Otros errores no manejados
      this.toastrService.error('Upps, ocurrió un error. Por favor, inténtelo de nuevo.', 'Error');
    }
  }
}