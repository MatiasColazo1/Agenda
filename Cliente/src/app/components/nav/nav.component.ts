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
  backgroundColor: string = '';

  constructor(
    public authService: AuthService,
    public darkModeService: DarkModeService,
    private nombreService: NombreService,
    private colorService: ColoresService
  ) { }

  setColor(color: string) {
    this.colorService.cambiarColor(color)
  }

  ngOnInit(): void {
    this.cargarColorInicial();
    this.colorService.currentBackgroundColor.subscribe(color => {
      this.backgroundColor = color;
    });

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

  cargarColorInicial() {
    // Obtiene el color desde el servidor
    this.authService.getColorUser().subscribe(
      (response) => {
        if (response && response.colorUser) {
          this.colorService.cambiarColor(response.colorUser);
        }
      },
      (error) => {
        console.error('Error al obtener el color del usuario desde el servidor', error);
      }
    );
  }


  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
}