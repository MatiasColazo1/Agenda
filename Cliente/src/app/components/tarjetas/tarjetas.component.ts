import { Component, OnInit } from '@angular/core';
import { TarjetasService } from 'src/app/services/tarjetas.service';

@Component({
  selector: 'app-tarjetas',
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.css']
})
export class TarjetasComponent implements OnInit {
  tarjetas: any[] = [];

  constructor(private tarjetasService: TarjetasService) { }

  ngOnInit(): void {
    this.tarjetasService.getTarjeta().subscribe((data: any) => {
      this.tarjetas = data;
    })
  }

}
