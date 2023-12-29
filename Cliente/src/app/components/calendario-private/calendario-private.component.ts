import { ChangeDetectorRef, Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DateSelectArg, EventApi, EventClickArg } from 'fullcalendar';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { INITIAL_EVENTS, createEventId } from 'src/app/event-utils';
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
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    locale: esLocale,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    events: []
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  
  currentEvents = signal<EventApi[]>([]);

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
    this.calendarioService.getEvents('2023-01-01', '2023-12-31').subscribe(events => {
      this.calendarOptions.update((options) => {
        return {
          ...options,
          initialView: 'dayGridMonth',
          weekends: false,
          eventClick: this.handleEventClick.bind(this),
          plugins: [dayGridPlugin],
          events: events
        };
      });
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
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }
}