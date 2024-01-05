import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DateSelectArg, EventApi, EventClickArg } from 'fullcalendar';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import esLocale from '@fullcalendar/core/locales/es';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { ColoresService } from 'src/app/services/colores.service';
import { Subscription } from 'rxjs';
import { CalendarioService, Evento } from 'src/app/services/calendario.service';

@Component({
  selector: 'app-calendario-private',
  templateUrl: './calendario-private.component.html',
  styleUrls: ['./calendario-private.component.css']
})
export class CalendarioPrivateComponent implements OnInit, OnDestroy {
  color: string = '';
  private subscription: Subscription = new Subscription();
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',

    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    locale: esLocale,
  
   /*  eventClick: this.handleEventClick.bind(this), */

    events: [],
    eventAdd: this.handleEventAdd.bind(this),
    eventChange: this.handleEventChange.bind(this),
    eventRemove: this.handleEventRemove.bind(this),
  });
  
  currentEvents = signal<EventApi[]>([]);

  Eventos: Evento[] = [];

  constructor(private changeDetector: ChangeDetectorRef, public darkModeService: DarkModeService, private colorService: ColoresService, private calendarioService: CalendarioService) {
  }

  ngOnInit(): void {
    this.loadEvents();
    this.subscription = this.colorService.currentColor.subscribe(color => {
      this.color = color;
    })
  }

  ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe();
    }
  }

  
  loadEvents(): void {
    const start = '2023-01-01';
    const end = '9999-12-31';
  
    this.calendarioService.getEvents(start, end).subscribe(events => {
      this.calendarOptions.update((options) => {
        return {
          ...options,
          events: events.map(event => ({
            id: event.id,
            title: event.title,
            start: event.start,
            end: event.end
          }))
        };
      });
    });
  }

  handleEventAdd(addInfo: any) {
    // Convertir el evento de FullCalendar a tu formato de evento
    const newEvent = {
      title: addInfo.event.title,
      start: addInfo.event.start.toISOString(),
      end: addInfo.event.end?.toISOString(),
    };

    this.calendarioService.crearEvento(newEvent).subscribe(
      (createdEvent) => {
        // Opcional: Actualizar ID del evento en el calendario si es necesario
        addInfo.event.setProp('_id', createdEvent.id);
      },
      error => {
        console.error('Error al crear el evento', error);
        addInfo.revert();
      }
    );
  }

  handleEventChange(changeInfo: any) {
    const updatedEvent = {
      _id: changeInfo.event._id,
      title: changeInfo.event.title,
      start: changeInfo.event.start.toISOString(),
      end: changeInfo.event.end?.toISOString(),

    };

    this.calendarioService.actualizarEvento(updatedEvent).subscribe(
      () => {/* Manejar éxito */},
      error => {
        console.error('Error al actualizar el evento', error);
        changeInfo.revert();
      }
    );
  }

  handleEventRemove(eventoId: any) {
    this.calendarioService.eliminarEvento(eventoId).subscribe(() => {
        this.Eventos = this.Eventos.filter(evento => evento.id !== eventoId);
    }, error => {
      console.error('Error al eliminar el evento', error);
    });
  }
  

  


  toggleDarkMode(){
    this.darkModeService.toggleDarkMode()
  }

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.mutate((options) => {
      options.weekends = !options.weekends;
    });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({

        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      this.handleEventRemove(clickInfo.event.id);
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }
}