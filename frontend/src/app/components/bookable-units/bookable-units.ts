import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnitService } from '../../services/unit';
import { BookingService } from '../../services/booking';
import { Unit } from '../../models/unit';

@Component({
  selector: 'app-bookable-units',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bookable-units.html',
  styleUrls: ['./bookable-units.css'],
})
export class BookableUnits implements OnInit {
  units: Unit[] = [];
  // filters
  maxPrice?: number | null = null;
  minYear?: number | null = null;
  transmission: string = '';
  fuel: string = '';
  minSeats?: number | null = null;

  // booking form
  selectedUnit?: Unit;
  bookingStart: string = '';
  bookingEnd: string = '';

  constructor(private unitService: UnitService, private bookingService: BookingService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadBookable();
  }

  loadBookable(): void {
    this.unitService.getBookableUnits().subscribe({
      next: (data) => {
        this.units = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading bookable units', err),
    });
  }

  get filtered(): Unit[] {
    return this.units.filter(u => {
      if (this.maxPrice != null && u.pricePerDay != null && +u.pricePerDay > +this.maxPrice) return false;
      if (this.minYear != null && u.vehicle && u.vehicle.year && +u.vehicle.year < +this.minYear) return false;
      if (this.transmission && u.vehicle && u.vehicle.transmission !== this.transmission) return false;
      if (this.fuel && u.vehicle && u.vehicle.fuel !== this.fuel) return false;
      if (this.minSeats != null && u.vehicle && u.vehicle.numberOfSeats < +this.minSeats) return false;
      return true;
    });
  }

  selectUnit(u: Unit) { this.selectedUnit = u; }

  createBooking(): void {
    if (!this.selectedUnit) return alert('Select a unit first');
    if (!this.bookingStart || !this.bookingEnd) return alert('Specify start and end');
    const payload = {
      clientName: 'Anonymous',
      unit: { id: this.selectedUnit.id },
      bookingStart: this.bookingStart,
      bookingEnd: this.bookingEnd,
    };
    this.bookingService.createBooking(payload as any).subscribe({
      next: () => { alert('Booking created'); this.selectedUnit = undefined; this.bookingStart = ''; this.bookingEnd = ''; this.loadBookable(); },
      error: (err) => { console.error('Error creating booking', err); alert('Error creating booking'); }
    });
  }
}
