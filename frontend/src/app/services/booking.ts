import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = '/api/bookings';

  constructor(private http: HttpClient) {}

  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  createBooking(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  patchBooking(id: number, updates: Partial<Booking>): Observable<Booking> {
    return this.http.patch<Booking>(`${this.apiUrl}/${id}`, updates);
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
