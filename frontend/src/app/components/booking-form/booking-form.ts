import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Booking } from '../../models/booking';
import { BookingService } from '../../services/booking';
import { UnitService } from '../../services/unit';
import { NotificationService } from '../../services/notification.service';
import { DateTimePickerComponent } from '../date-time-picker/date-time-picker.component';

@Component({
	selector: 'app-booking-form',
	standalone: true,
	imports: [CommonModule, FormsModule, DateTimePickerComponent],
	templateUrl: './booking-form.html'
})
export class BookingForm implements OnChanges {
	@Input() booking?: Booking | null;
	@Output() saved = new EventEmitter<Booking>();
	@Output() closed = new EventEmitter<void>();

	isEdit = false;
	units: any[] = [];
	formUnitId?: number;
	formClientName: string = '';
	formBookingStart: string = '';
	formBookingEnd: string = '';
	formBookingDateStart: string = '';
	formBookingTimeStart: string = '';
	formBookingDateEnd: string = '';
	formBookingTimeEnd: string = '';
	formError = '';

	constructor(private bookingService: BookingService, private unitService: UnitService, private notif: NotificationService, private cdr: ChangeDetectorRef) {
		this.loadUnits();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['booking']) this.loadFromInput();
	}

	private loadUnits(): void {
		this.unitService.getUnits().subscribe({ next: u => { this.units = u; this.cdr.detectChanges(); }, error: e => console.error(e) });
	}

	get availableUnits() {
		return this.units.filter(u => u.bookable === true);
	}

	onDateChange(): void {
		this.formBookingStart = `${this.formBookingDateStart}T${this.formBookingTimeStart}`;
		this.formBookingEnd = `${this.formBookingDateEnd}T${this.formBookingTimeEnd}`;
	}

	toLocalISO(d: Date): string {
    // getTimezoneOffset returns minutes; convert to milliseconds
    const offset = d.getTimezoneOffset() * 60000; 
    const localDate = new Date(d.getTime() - offset);
    
    // Returns "2026-03-14T01:34" -> change 'T' to space
    return localDate.toISOString().slice(0, 16).replace('T', ' ');
}

	private loadFromInput() {
		if (this.booking) {
			this.isEdit = true;
			this.formUnitId = this.booking.unit?.id;
			this.formClientName = this.booking.clientName;
			this.formBookingStart = this.toLocalISO(this.booking.bookingStart);
			[this.formBookingDateStart, this.formBookingTimeStart] = this.formBookingStart.split(' ');
			this.formBookingEnd = this.toLocalISO(this.booking.bookingEnd);
			[this.formBookingDateEnd, this.formBookingTimeEnd] = this.formBookingEnd.split(' ');
			this.formError = '';
		} else {
			this.isEdit = false;
			this.formUnitId = undefined;
			this.formClientName = '';
			this.formBookingStart = '';
			this.formBookingEnd = '';
			this.formError = '';
		}
	}

	save(): void {
		// validation
		if (!this.isEdit && !this.formUnitId) {
			this.formError = 'Unit selection is required';
			this.notif.showError(this.formError);
			return;
		}
		if ((this.isEdit && this.formClientName == null) || this.formClientName.trim().length == 0) {
			this.formError = 'Client name is required';
			this.notif.showError(this.formError);
			return;
		}
		if (!this.isEdit && this.formBookingStart == null) {
			this.formError = 'Booking start is required';
			this.notif.showError(this.formError);
			return;
		}
		if (!this.isEdit && this.formBookingEnd == null) {
			this.formError = 'Booking end is required';
			this.notif.showError(this.formError);
			return;
		}
		if (this.formBookingStart && this.formBookingEnd && this.formBookingStart >= this.formBookingEnd) {
			this.formError = 'Booking end must be after start';
			this.notif.showError(this.formError);
			return;
		}
		if (this.isEdit && this.booking?.id) {
			const patchPayload: any = {
				bookingStart: this.formBookingStart.replace(' ', 'T') + ':00',
				bookingEnd: this.formBookingEnd.replace(' ', 'T') + ':00'
			};
			if (this.formClientName) {
				patchPayload['clientName'] = this.formClientName.trim();
			}
				
			console.log(patchPayload);
			this.bookingService.patchBooking(this.booking.id, patchPayload).subscribe({
				next: b => { this.notif.showSuccess('Booking updated'); this.saved.emit(b); },
				error: e => { console.error(e); this.notif.showError('Error updating booking'); }
			});
		} else {
			const createPayload: any = {
				clientName: this.formClientName.trim(),
				unit: { id: this.formUnitId || null },
				bookingStart: this.formBookingStart,
				bookingEnd: this.formBookingEnd
			};
			this.bookingService.createBooking(createPayload as Booking).subscribe({
				next: b => { this.notif.showSuccess('Booking created'); this.saved.emit(b); },
				error: e => { console.error(e); this.notif.showError('Error creating booking'); }
			});
		}
	}

	cancel(): void { this.closed.emit(); }
}
