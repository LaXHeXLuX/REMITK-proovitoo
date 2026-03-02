import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnitService } from '../../services/unit';
import { BookingService } from '../../services/booking';
import { Unit } from '../../models/unit';
import { VehicleDescriptionPipe } from '../../pipes/vehicle-description-pipe';

@Component({
	selector: 'app-bookable-units',
	standalone: true,
	imports: [CommonModule, FormsModule, VehicleDescriptionPipe],
	templateUrl: './bookable-units.html',
	styleUrls: ['./bookable-units.css'],
})
export class BookableUnits implements OnInit {
	units: Unit[] = [];
	desiredStart: string = '';
	desiredEnd: string = '';
	searched: boolean = false;
	desiredDateStart: string = '';
	desiredTimeStart: string = '';
	desiredDateEnd: string = '';
	desiredTimeEnd: string = '';
	dayStartHour: number = 8;
	dayEndHour: number = 20;
	timeOptions: string[] = [];

	priceFrom?: number | null = null;
	priceTo?: number | null = null;
	minSeats?: number | null = null;
	transmissionFilters: Record<string, boolean> = { manual: false, automatic: false };
	fuelFilters: Record<string, boolean> = { diesel: false, gasoline: false, electric: false, LPG: false };

	selectedUnit?: Unit;
	bookingStart: string = '';
	bookingEnd: string = '';
	bookingDateStart: string = '';
	bookingTimeStart: string = '';
	bookingDateEnd: string = '';
	bookingTimeEnd: string = '';

	constructor(private unitService: UnitService, private bookingService: BookingService, private cdr: ChangeDetectorRef) {
		this.timeOptions = this.generateTimeOptions();
	}

	ngOnInit(): void { }

	fetchAvailable(): void {
		if (!this.desiredDateStart || !this.desiredTimeStart || !this.desiredDateEnd || !this.desiredTimeEnd) return alert('Provide start and end date/time');
		this.desiredStart = `${this.desiredDateStart}T${this.desiredTimeStart}`;
		this.desiredEnd = `${this.desiredDateEnd}T${this.desiredTimeEnd}`;
		this.unitService.getAvailable(this.desiredStart, this.desiredEnd).subscribe({
			next: (data) => { this.units = data; this.searched = true; this.cdr.detectChanges(); },
			error: (err) => { console.error('Error loading available vehicles', err); alert('Error loading available vehicles'); }
		});
	}

	onDesiredChange(): void {
		this.searched = false;
		this.units = [];
		this.desiredStart = '';
		this.desiredEnd = '';
		this.validateDesiredRange();
	}

	private combineDateTime(date: string | undefined, time: string | undefined): Date | null {
		if (!date || !time) return null;
		const d = new Date(`${date}T${time}`);
		return isNaN(d.getTime()) ? null : d;
	}

	private validateDesiredRange(): void {
		const now = new Date();
		const start = this.combineDateTime(this.desiredDateStart, this.desiredTimeStart);
		if (start && start.getTime() < now.getTime()) {
			this.desiredTimeStart = '';
		}
		const end = this.combineDateTime(this.desiredDateEnd, this.desiredTimeEnd);
		if (end) {
			const checks = [now, start];
			checks.forEach(check => {
				if (check === null) return;
				if (end.getTime() < check.getTime()) {
					this.desiredTimeEnd = '';
					if (end.getDate() < check.getDate()) {
						this.desiredDateEnd = '';
					}
				}
			});
		}
		if (this.desiredTimeStart && this.isDesiredStartTimeDisabled(this.desiredTimeStart)) this.desiredTimeStart = '';
		if (this.desiredTimeEnd && this.isDesiredEndTimeDisabled(this.desiredTimeEnd)) this.desiredTimeEnd = '';
	}

	private generateTimeOptions(): string[] {
		const opts: string[] = [];
		for (let h = this.dayStartHour; h <= this.dayEndHour; h++) {
			for (let m = 0; m < 60; m += 15) {
				if (h === this.dayEndHour && m > 0) continue;
				const hh = String(h).padStart(2, '0');
				const mm = String(m).padStart(2, '0');
				opts.push(`${hh}:${mm}`);
			}
		}
		return opts;
	}

	todayString(): string {
		const d = new Date();
		const pad = (n: number) => String(n).padStart(2, '0');
		return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
	}

	private timeToMinutes(t: string): number {
		if (!t) return -Infinity;
		const [hh, mm] = t.split(':').map(s => parseInt(s, 10));
		return hh * 60 + mm;
	}

	private nowMinutes(): number {
		const d = new Date();
		return d.getHours() * 60 + d.getMinutes();
	}

	isDesiredStartTimeDisabled(opt: string): boolean {
		if (!this.desiredDateStart) return false;
		if (this.desiredDateStart !== this.todayString()) return false;
		return this.timeToMinutes(opt) < this.nowMinutes();
	}

	isDesiredEndTimeDisabled(opt: string): boolean {
		if (!this.desiredDateEnd) return false;
		if (this.desiredDateStart && this.desiredDateEnd === this.desiredDateStart && this.desiredTimeStart) {
			return this.timeToMinutes(opt) <= this.timeToMinutes(this.desiredTimeStart);
		}
		if (this.desiredDateEnd === this.todayString()) return this.timeToMinutes(opt) < this.nowMinutes();
		return false;
	}

	isBookingStartTimeDisabled(opt: string): boolean {
		if (!this.bookingDateStart) return false;
		if (this.bookingDateStart !== this.todayString()) return false;
		return this.timeToMinutes(opt) < this.nowMinutes();
	}

	isBookingEndTimeDisabled(opt: string): boolean {
		if (!this.bookingDateEnd) return false;
		if (this.bookingDateStart && this.bookingDateEnd === this.bookingDateStart && this.bookingTimeStart) {
			return this.timeToMinutes(opt) <= this.timeToMinutes(this.bookingTimeStart);
		}
		if (this.bookingDateEnd === this.todayString()) return this.timeToMinutes(opt) < this.nowMinutes();
		return false;
	}

	get filtered(): Unit[] {
		return this.units.filter(u => {
			const price = u.pricePerDay ?? 0;
			if (this.priceFrom != null && price < +this.priceFrom) return false;
			if (this.priceTo != null && price > +this.priceTo) return false;
			if (this.minSeats != null && u.vehicle && u.vehicle.numberOfSeats < +this.minSeats) return false;
			const transSelected = Object.keys(this.transmissionFilters).filter(k => this.transmissionFilters[k]);
			if (transSelected.length > 0 && u.vehicle && !transSelected.includes(u.vehicle.transmission)) return false;
			const fuelSelected = Object.keys(this.fuelFilters).filter(k => this.fuelFilters[k]);
			if (fuelSelected.length > 0 && u.vehicle && !this.fuelFilters[u.vehicle.fuel]) return false;
			return true;
		});
	}

	selectUnit(u: Unit) {
		this.selectedUnit = u;
		if (this.desiredDateStart && this.desiredTimeStart) {
			this.bookingDateStart = this.desiredDateStart;
			this.bookingTimeStart = this.desiredTimeStart;
		} else if (this.desiredStart) {
			const [d, t] = this.desiredStart.split('T'); this.bookingDateStart = d; this.bookingTimeStart = t;
		}
		if (this.desiredDateEnd && this.desiredTimeEnd) {
			this.bookingDateEnd = this.desiredDateEnd;
			this.bookingTimeEnd = this.desiredTimeEnd;
		} else if (this.desiredEnd) {
			const [d, t] = this.desiredEnd.split('T'); this.bookingDateEnd = d; this.bookingTimeEnd = t;
		}
		this.bookingStart = this.bookingDateStart && this.bookingTimeStart ? `${this.bookingDateStart}T${this.bookingTimeStart}` : '';
		this.bookingEnd = this.bookingDateEnd && this.bookingTimeEnd ? `${this.bookingDateEnd}T${this.bookingTimeEnd}` : '';
	}

	onBookingChange(): void {
		this.validateBookingRange();
		this.bookingStart = this.bookingDateStart && this.bookingTimeStart ? `${this.bookingDateStart}T${this.bookingTimeStart}` : '';
		this.bookingEnd = this.bookingDateEnd && this.bookingTimeEnd ? `${this.bookingDateEnd}T${this.bookingTimeEnd}` : '';
	}

	private validateBookingRange(): void {
		const now = new Date();
		const start = this.combineDateTime(this.bookingDateStart, this.bookingTimeStart);
		if (start && start.getTime() < now.getTime()) {
			this.bookingTimeStart = '';
		}
		const end = this.combineDateTime(this.bookingDateEnd, this.bookingTimeEnd);
		if (end) {
			if (start && end.getTime() <= start.getTime()) {
				this.bookingTimeEnd = '';
			} else if (end.getTime() < now.getTime()) {
				this.bookingTimeEnd = '';
			}
		}
		if (this.bookingTimeStart && this.isBookingStartTimeDisabled(this.bookingTimeStart)) this.bookingTimeStart = '';
		if (this.bookingTimeEnd && this.isBookingEndTimeDisabled(this.bookingTimeEnd)) this.bookingTimeEnd = '';
	}

	createBooking(): void {
		if (!this.selectedUnit) return alert('Select a unit first');
		if (this.bookingDateStart && this.bookingTimeStart && this.bookingDateEnd && this.bookingTimeEnd) {
			this.bookingStart = `${this.bookingDateStart}T${this.bookingTimeStart}`;
			this.bookingEnd = `${this.bookingDateEnd}T${this.bookingTimeEnd}`;
		}
		if (!this.bookingStart || !this.bookingEnd) return alert('Specify start and end');
		const clientName = prompt('Enter your name:');
		if (!clientName) return alert('Client name is required');
		const payload = {
			clientName,
			unit: { id: this.selectedUnit.id },
			bookingStart: this.bookingStart,
			bookingEnd: this.bookingEnd,
		};
		this.bookingService.createBooking(payload as any).subscribe({
			next: () => { alert('Booking created'); this.selectedUnit = undefined; this.bookingStart = ''; this.bookingEnd = ''; if (this.desiredStart && this.desiredEnd) this.fetchAvailable(); },
			error: (err) => { console.error('Error creating booking', err); alert('Error creating booking'); }
		});
	}

	private parseISOToDate(iso?: string): Date | null {
		if (!iso) return null;
		const d = new Date(iso);
		return isNaN(d.getTime()) ? null : d;
	}

	private totalDaysForRange(): number {
		const startIso = this.desiredStart || this.bookingStart;
		const endIso = this.desiredEnd || this.bookingEnd;
		const s = this.parseISOToDate(startIso);
		const e = this.parseISOToDate(endIso);
		if (!s || !e) return 1;
		const msPerDay = 24 * 60 * 60 * 1000;
		const diff = e.getTime() - s.getTime();
		if (diff <= 0) return 1;
		return Math.max(1, Math.ceil(diff / msPerDay));
	}

	computePrice(u: Unit): number {
		const days = this.totalDaysForRange();
		const pricePerDay = u.pricePerDay ?? 0;
		return pricePerDay * days;
	}
}
