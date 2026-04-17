import { Component } from '@angular/core';
import { EventsComponent } from './events/events';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EventsComponent],
  template: `<app-events></app-events>`
})
export class App {}