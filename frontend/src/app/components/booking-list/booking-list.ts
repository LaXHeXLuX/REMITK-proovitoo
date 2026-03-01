import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking';
import { Booking } from '../../models/booking';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-list.html',
  styleUrls: ['./booking-list.css'],
})
export class BookingList implements OnInit {
  bookings: Booking[] = [];

  constructor(private bookingService: BookingService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getBookings().subscribe({
      next: (data) => {
        this.bookings = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading bookings', err),
    });
  }

  deleteBooking(id?: number): void {
    if (!id) return;
    if (!confirm('Delete this booking?')) return;
    this.bookingService.deleteBooking(id).subscribe({
      next: () => this.loadBookings(),
      error: (err) => console.error('Error deleting booking', err),
    });
  }
}
