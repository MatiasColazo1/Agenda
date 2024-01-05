import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CalendarioService } from 'src/app/services/calendario.service';

interface EventoCalendario {
  id: string;
  title: string;
  start: Date;
  end: Date;
  // otras propiedades...
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  title: string = '';
  cardColor: { backgroundColor: string, textColor: string } = { backgroundColor: '#039be5', textColor: '#ffffff' };
  event: EventoCalendario | undefined;

  listColorsCard: ColorsCard[] = [
    { backgroundColor: 'rgb(213, 0, 0)', textColor: '#fff' },
    { backgroundColor: 'rgb(51, 182, 121)', textColor: '#fff' },
    { backgroundColor: 'rgb(246, 191, 38)', textColor: '#fff' },
    { backgroundColor: 'rgb(3, 155, 229)', textColor: '#fff' },
    { backgroundColor: 'rgb(97, 97, 97)', textColor: '#fff' },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ModalComponent>,
    private calendarioService: CalendarioService
  ) { }


  ngOnInit(): void {
    
    console.log(this.data.eventInfos);
    if (this.data.isEdit) {
      this.title = this.data.eventInfos?.event?.title;
      this.cardColor = {
        backgroundColor: this.data.eventInfos?.event?.backgroundColor,
        textColor: this.data.eventInfos?.event?.textColor,
      };
    }
  }
  

  handleAddedEvent(): void {
    if (!this.data.isEdit) {
      // Crear nuevo evento
      this.calendarioService.createEventCalendar({
        title: this.title || 'Sin título',
        start: this.data.eventInfos.startStr,
        end: this.data.eventInfos.endStr,
        backgroundColor: this.cardColor.backgroundColor,
        textColor: this.cardColor.textColor,
      }).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          this.dialogRef.close('updated');
          this.data.eventUpdateCallback('updated');
        },
        error: (error) => {
          console.error('Error en la solicitud:', error);
        }
      });
    } else {
      // Actualizar evento existente
      this.calendarioService.updateEventCalendar({  
        _id: this.data.eventInfos.event.extendedProps['_id'],
        title: this.title || 'Sin título',
        start: this.data.eventInfos.event.startStr,
        end: this.data.eventInfos.event.endStr,
        backgroundColor: this.cardColor.backgroundColor,
        textColor: this.cardColor.textColor,
      }).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          this.dialogRef.close('updated');
          this.data.eventUpdateCallback('updated');
        },
        error: (error) => {
          console.error('Error en la solicitud:', error);
        }
      }); 
      console.log(this.data);
    }
  }

  handleDeleteEvent(): void {
    
    console.log("Datos del evento:", this.data.eventInfos);
    const eventId = this.data.eventInfos.id;
    console.log("ID recibido:", eventId);
  
    if (eventId) {
      this.calendarioService.deleteEventCalendar(eventId).subscribe({
        next: () => {
          this.dialogRef.close('updated');
        },
        error: (error) => {
          console.error('Error al eliminar el evento:', error);
        }
      });
    } else {
      console.error('El ID del evento es undefined');
    }
  }




  handleSelectCardColor(color: ColorsCard): void {
    this.cardColor = {
      backgroundColor: color.backgroundColor,
      textColor: color.textColor,
    };
  }

  closeDialog(): void {
    this.dialogRef.close('updated');
  }
}

interface ColorsCard {
  backgroundColor: string;
  textColor: string;
}