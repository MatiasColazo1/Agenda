import { EventInput } from '@fullcalendar/core';
import { Evento } from './services/calendario.service';

let eventGuid = 0;
const TODAY_STR = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

export const INITIAL_EVENTS: Evento[] = []; 

export function createEventId() {
  return String(eventGuid++);
}