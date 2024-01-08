import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DateSelectArg, EventApi } from 'fullcalendar';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { MatDialog } from '@angular/material/dialog';
import esLocale from '@fullcalendar/core/locales/es';
import { DarkModeService } from 'src/app/services/dark-mode.service';
import { ColoresService } from 'src/app/services/colores.service';
import { Subscription } from 'rxjs';
import { CalendarioService } from 'src/app/services/calendario.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-calendario-private',
  templateUrl: './calendario-private.component.html',
  styleUrls: ['./calendario-private.component.css']
})
export class CalendarioPrivateComponent implements OnInit, OnDestroy {
  color: string = '';
  private subscription: Subscription = new Subscription();
  calendarVisible = signal(true);
  calendarOptions: CalendarOptions = {
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
    firstDay: 0,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    locale: esLocale,
    events: [],
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };
  
  currentEvents: EventApi[] = [];

  constructor(
     private changeDetector: ChangeDetectorRef,
     public darkModeService: DarkModeService, 
     private colorService: ColoresService, 
     private calendarioService: CalendarioService, 
     public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.subscription = this.colorService.currentColor.subscribe(color => {
      this.color = color;
    });
    this.calendarioService.getAllEventsCalendar().subscribe(data => {
      this.updateEvents(data);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe();
    }
  }

  
  openModal(eventInfos: any, isEdit: boolean): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '250px',
      data: { eventInfos, isEdit }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.fetchAndUpdateEvents();
      }
    });
  }
  
  fetchAndUpdateEvents(): void {
    this.calendarioService.getAllEventsCalendar().subscribe(data => {
      this.updateEvents(data);
    });
  }

  handleEventClick(clickInfo: EventClickArg): void {
    let eventInfo = {
      id: clickInfo.event.extendedProps['_id'],
      event: clickInfo.event,
      start: clickInfo.event.start, // Fecha de inicio
      end: clickInfo.event.end // Fecha de finalización
    };
  
    this.openModal(eventInfo, true);
  }

  handleDateClick(arg: any): void {
    const startDate = new Date(arg.dateStr);
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1);
   
    this.openAddEventModal(startDate, endDate);
  }

  openAddEventModal(startDate: Date, endDate: Date): void {
    const eventInfos = {
      startStr: startDate.toISOString(),
      endStr: endDate.toISOString()
    };
  
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '250px',
      data: { eventInfos, isEdit: false, eventUpdateCallback: this.fetchAndUpdateEvents.bind(this) }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal cerrado', result);
    });
  }

  toggleDarkMode(){
    this.darkModeService.toggleDarkMode()
  }

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions = {
      ...this.calendarOptions,
      weekends: !this.calendarOptions.weekends
    };
    this.changeDetector.detectChanges();
  }

 
  updateEvents(events: any[]) {
    console.log('Actualizando eventos:', events);
    this.calendarOptions.events = events;
    this.changeDetector.detectChanges();
  }
 
}