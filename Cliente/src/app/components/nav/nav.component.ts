// nav.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ColoresService } from 'src/app/services/colores.service';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { NombreService } from 'src/app/services/nombre.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  nombreUsuario: string = '';

  constructor(
    public authService: AuthService,
    public darkModeService: DarkModeService,
    private nombreService: NombreService,
    private colorSevice: ColoresService
  ) { }

  setColor(color: string) {
    this.colorSevice.cambiarColor(color)
  }

  ngOnInit(): void {
    this.nombreService.getUserDetails().subscribe(
      (response) => {
        console.log('Respuesta del servicio:', response); // Imprime la respuesta completa en la consola

        // Asegúrate de que la propiedad en la respuesta es correcta
        this.nombreUsuario = response.usuario;
      },
      (error) => {
        console.error('Error al obtener detalles del usuario', error);
      }
    );
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
}