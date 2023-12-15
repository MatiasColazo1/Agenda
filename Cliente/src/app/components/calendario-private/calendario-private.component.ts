import { Component, OnInit } from '@angular/core';
import { CalendarioService } from 'src/app/services/calendario.service';
import { NzCalendarMode } from 'ng-zorro-antd/calendar';

@Component({
  selector: 'app-calendario-private',
  templateUrl: './calendario-private.component.html',
  styleUrls: ['./calendario-private.component.css']
})
export class CalendarioPrivateComponent implements OnInit{
  date = new Date(2012, 11, 21);
  mode: NzCalendarMode = 'month';

  panelChange(change: { date: Date; mode: string }): void {
    console.log(change.date, change.mode);
  }
  constructor(private calendarioService: CalendarioService) { }

  ngOnInit(): void {
    
  }

  scheduleEvent() {
    this.calendarioService.scheduleEvent().subscribe(
     (response) => {
      console.log('Evento programado correctamente', response);
     },
     (error) => {
      console.log('Error al programar el evento:', error);
     }
    )
  }

}
