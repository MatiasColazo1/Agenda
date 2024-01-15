import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, signal } from '@angular/core';
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
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-calendario-private',
  templateUrl: './calendario-private.component.html',
  styleUrls: ['./calendario-private.component.css']
})
export class CalendarioPrivateComponent implements OnInit, OnDestroy {
  isDarkMode: boolean = false;
  isSwitchOn: boolean = false;
  isSidebarClosed: boolean = false;
  loading = true;
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
   
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
  };

  currentEvents: EventApi[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.adjustCalendarView(event.target.innerWidth);
  }

  constructor(
     private changeDetector: ChangeDetectorRef,
     public darkModeService: DarkModeService, 
     private colorService: ColoresService, 
     private calendarioService: CalendarioService, 
     public dialog: MatDialog,
     private authService: AuthService) {
  }

  

  ngOnInit(): void {
    this.adjustCalendarView(window.innerWidth);
    this.calendarOptions.initialView = window.innerWidth > 768 ? 'dayGridMonth' : 'listWeek';
    this.subscription = this.colorService.currentColor.subscribe(color => {
      this.color = color;
    });
    this.calendarioService.getAllEventsCalendar().subscribe(data => {
      this.updateEvents(data);
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe();
    }
  }

  toggleSwitch(): void {
    this.isSwitchOn = !this.isSwitchOn;

    if (this.isSwitchOn) {
      this.closeSidebar();
    } else {
      this.openSidebar();
    }
  }

  closeSidebar(): void {
    this.isSidebarClosed = true;
  }

  openSidebar(): void {
    this.isSidebarClosed = false;
  }

  adjustCalendarView(width: number) {
    const isMobile = width < 768; // Considera 'mobile' un ancho menor a 768px
    this.calendarOptions.headerToolbar = isMobile
      ? { left: 'prev,next', center: 'title', right: 'listWeek,timeGridDay' }
      : { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek' };
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
    this.loading = true;
    this.calendarioService.getAllEventsCalendar().subscribe(data => {
      this.updateEvents(data);
      this.loading = false;
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