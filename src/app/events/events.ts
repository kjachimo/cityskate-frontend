import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventsService } from './events.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './events.html',
  styleUrls: ['./events.css']
})
export class EventsComponent implements OnInit {

  events: any[] = [];
  editingId: number | null = null;

  // 🔥 frontendowy stan „czy dołączyłem”
  joinedEvents: Set<number> = new Set();

  newEvent = this.emptyEvent();

  constructor(
    private eventsService: EventsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  emptyEvent() {
    return {
      name: '',
      description: '',
      startDateTime: '',
      endDateTime: '',
      lat: 50,
      lng: 19,
      locationName: '',
      maxParticipants: 10
    };
  }

  loadEvents() {
    this.eventsService.getEvents().subscribe(res => {
      this.events = res.content ?? res;
      this.cdr.detectChanges();
    });
  }

  addEvent(event: Event) {
    event.preventDefault();

    const payload = {
      ...this.newEvent,
      startDateTime: this.formatDate(this.newEvent.startDateTime),
      endDateTime: this.formatDate(this.newEvent.endDateTime)
    };

    if (this.editingId) {
      this.eventsService.updateEvent(this.editingId, payload).subscribe(() => {
        this.resetForm();
      });
    } else {
      this.eventsService.createEvent(payload).subscribe(() => {
        this.resetForm();
      });
    }
  }

  editEvent(e: any) {
    this.editingId = e.id;

    this.newEvent = {
      ...e,
      startDateTime: this.toInputDate(e.startDateTime),
      endDateTime: this.toInputDate(e.endDateTime)
    };
  }

  deleteEvent(id: number) {
    this.eventsService.deleteEvent(id).subscribe(() => {
      this.loadEvents();
    });
  }

  // 🔥 JOIN / LEAVE

  joinEvent(id: number) {
    this.eventsService.joinEvent(id).subscribe(() => {
      this.joinedEvents.add(id);
      this.loadEvents();
    });
  }

  leaveEvent(id: number) {
    this.eventsService.leaveEvent(id).subscribe(() => {
      this.joinedEvents.delete(id);
      this.loadEvents();
    });
  }

  resetForm() {
    this.editingId = null;
    this.newEvent = this.emptyEvent();
    this.loadEvents();
  }

  formatDate(date: string) {
    if (!date) return null;
    return date + ':00Z';
  }

  toInputDate(date: string) {
    if (!date) return '';
    return date.substring(0, 16);
  }

  formatDisplayDate(date: string) {
    if (!date) return '';
    return new Date(date).toLocaleString();
  }
}