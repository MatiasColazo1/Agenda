import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { TarjetasService } from 'src/app/services/tarjetas.service';

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.css']
})
export class TarjetasComponent implements OnInit {
  tarjetas: any[] = [];
  nuevaTarjeta: any = {
    titulo:'',
    descripcion:''
  }

  constructor(private tarjetasService: TarjetasService, public darkModeService: DarkModeService) { }

  ngOnInit(): void {
    this.getTarjetas()
  }

  getTarjetas() {
    this.tarjetasService.getTarjeta().subscribe((data: any) => {
      this.tarjetas = data.map((tarjeta: any) => ({ ...tarjeta, expandida: false }));
    })
  }


  postTarjeta() {
    this.tarjetasService.postTarjeta(this.nuevaTarjeta).subscribe(
    (data: any) => {
      console.log('Tarjeta agregada con exito: ', data);
      this.getTarjetas();
      this.nuevaTarjeta = {}
    },
    (error) => {
      console.error('Error al agregar tarjeta: ', error);
    }
    )
  }

  toggleTarjeta(tarjeta: any) {
    // Cambiar el estado expandido al hacer clic en la tarjeta
    tarjeta.expandida = !tarjeta.expandida;
  }

  // En tu componente TypeScript
dragStart(event: DragEvent, tarjeta: any) {
  // Almacenar la tarjeta actual en el objeto de transferencia de datos
  event.dataTransfer?.setData('text/plain', JSON.stringify(tarjeta));
}

dragOver(event: DragEvent) {
  // Prevenir el comportamiento predeterminado para permitir el drop
  event.preventDefault();
}

// En tu componente TypeScript
drop(event: DragEvent, targetTarjeta: any) {
  // Evitar el comportamiento predeterminado para permitir el drop
  event.preventDefault();

  // Obtener los datos de la tarjeta arrastrada desde el objeto de transferencia de datos
  const draggedTarjeta = JSON.parse(event.dataTransfer?.getData('text/plain') || '');

  // Obtener índices de las tarjetas
  const draggedIndex = this.tarjetas.findIndex(tarjeta => tarjeta === draggedTarjeta);
  const targetIndex = this.tarjetas.findIndex(tarjeta => tarjeta === targetTarjeta);

  // Intercambiar las tarjetas en el arreglo
  [this.tarjetas[draggedIndex], this.tarjetas[targetIndex]] = [this.tarjetas[targetIndex], this.tarjetas[draggedIndex]];
}
}
