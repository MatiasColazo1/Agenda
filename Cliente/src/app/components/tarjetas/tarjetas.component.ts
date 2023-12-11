import { Component, OnInit } from '@angular/core';
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

  constructor(private tarjetasService: TarjetasService) { }

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
}
