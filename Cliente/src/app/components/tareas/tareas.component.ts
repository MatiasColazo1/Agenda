import { Component, OnInit } from '@angular/core';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { TareasService } from 'src/app/services/tareas.service';

@Component({
  selector: 'app-tareas',
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css'],

})
export class TareasComponent implements OnInit {

  tareas: any[] = [];

  constructor(private tareasService: TareasService, public darkModeService: DarkModeService) { }

  ngOnInit() {
    this.getTareas();
  }

  // ----------------------- TRAER TAREAS ----------------- //
  getTareas() {
    this.tareasService.getTarea().subscribe((data: any) => {
      this.tareas = data
    })
  }
}
