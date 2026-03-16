import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking';
import { Booking } from '../../models/booking';
import { NotificationService } from '../../services/notification.service';
import { BookingForm } from '../booking-form/booking-form';
import { matchBooking } from '../../utils';

@Component({
	selector: 'app-booking-list',
	standalone: true,
	imports: [CommonModule, BookingForm, FormsModule],
	templateUrl: './booking-list.html',
	styleUrls: ['../data-list.css']
})
export class BookingList implements OnInit {
	bookings: Booking[] = [];
	showCurrent = false;
	showForm = false;
	searchText: string = '';
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
		let filteredBookings = this.bookings;
		if (this.showCurrent) {
			const now = Date.now()
			filteredBookings = this.bookings.filter((b) => b.bookingStart.getTime() <= now && b.bookingEnd.getTime() >= now);
		}

		const term = this.searchText?.toLowerCase().trim();
		if (term) {
			filteredBookings = filteredBookings.filter((b) => matchBooking(term, b));
		}
		return filteredBookings
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
