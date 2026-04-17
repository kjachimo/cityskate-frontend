import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EventsService {

  private apiUrl = 'http://localhost:8080/CitySkate/events';

  constructor(private http: HttpClient) {}

  getEvents() {
    return this.http.get<any>(this.apiUrl);
  }

  createEvent(event: any) {
    return this.http.post(this.apiUrl, event);
  }

  updateEvent(id: number, event: any) {
    return this.http.put(`${this.apiUrl}/${id}`, event);
  }

  deleteEvent(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  joinEvent(id: number) {
  return this.http.post(`${this.apiUrl}/${id}/participants`, {});
}

leaveEvent(id: number) {
  return this.http.delete(`${this.apiUrl}/${id}/participants`);
}
}