import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../services/booking';
import { Booking } from '../../models/booking';
import { NotificationService } from '../../services/notification.service';
import { BookingForm } from '../booking-form/booking-form';

@Component({
	selector: 'app-booking-list',
	standalone: true,
	imports: [CommonModule, BookingForm],
	templateUrl: './booking-list.html',
	styleUrls: ['../data-list.css']
})
export class BookingList implements OnInit {
	bookings: Booking[] = [];
	showCurrent = false;
	showForm = false;
	selectedBooking?: Booking | null = null;

	constructor(private bookingService: BookingService, private cdr: ChangeDetectorRef, private notif: NotificationService) { }

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

	get filtered(): Booking[] {
		if (!this.showCurrent) return this.bookings;
		const now = Date.now()
		return this.bookings.filter((b) => b.bookingStart.getTime() <= now && b.bookingEnd.getTime() >= now);
	}

	deleteBooking(id?: number): void {
		if (!id) return;
		if (!confirm('Delete this booking?')) return;
		this.bookingService.deleteBooking(id).subscribe({
			next: () => this.loadBookings(),
			error: (err) => console.error('Error deleting booking', err),
		});
	}

	openCreate(): void { this.selectedBooking = null; this.showForm = true; }
	openEdit(b: Booking): void { this.selectedBooking = b; this.showForm = true; }
	onSaved(_: Booking): void { this.showForm = false; this.loadBookings(); }
	onClosed(): void { this.showForm = false; }
}
