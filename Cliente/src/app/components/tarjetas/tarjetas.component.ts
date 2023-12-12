import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { TarjetasService } from 'src/app/services/tarjetas.service';


@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.css']
})
export class TarjetasComponent implements OnInit {
 
  @ViewChild('modal', { static: true }) modalAbrir!: ElementRef
  tarjetas: any[] = [];
  nuevaTarjeta: any = {
    titulo:'',
    descripcion:''
  }
  tarjetaActiva: any = null;

  constructor(private tarjetasService: TarjetasService, public darkModeService: DarkModeService, private modalService: NgbModal) { }
  
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
    if (this.tarjetaActiva !== tarjeta) {
      // Cambiar el estado expandido solo si la tarjeta no está en modo de arrastrar
      tarjeta.expandida = !tarjeta.expandida;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tarjetas, event.previousIndex, event.currentIndex);
  }

  activarModoArrastrar(tarjeta: any) {
    this.tarjetaActiva = tarjeta;
  }

}
