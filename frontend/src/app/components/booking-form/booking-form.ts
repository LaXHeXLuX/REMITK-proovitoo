import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Booking } from '../../models/booking';
import { BookingService } from '../../services/booking';
import { Unit } from '../../models/unit';
import { UnitService } from '../../services/unit';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="booking-form">
      <h3>{{ isEdit ? 'Edit Booking' : 'Create Booking' }}</h3>
      <div *ngIf="formError" style="color:#b91c1c; margin-bottom:8px">{{ formError }}</div>
      <div>
        <label>Vehicle
          <select [(ngModel)]="formUnitId">
            <option [ngValue]="undefined">--select--</option>
            <option *ngFor="let u of units" [ngValue]="u.id">{{ u.vehicle.name }}</option>
          </select>
        </label>
      </div>
      <div>
        <label>Client name
          <input [(ngModel)]="formClientName" />
        </label>
      </div>
      <div>
        <label>Booking start
          <input type="date" [(ngModel)]="formBookingStart" />
        </label>
      </div>
      <div>
        <label>Booking end
          <input type="date" [(ngModel)]="formBookingEnd" />
        </label>
      </div>
      <div class="actions">
        <button (click)="save()">{{ isEdit ? 'Save' : 'Create' }}</button>
        <button (click)="cancel()">Cancel</button>
      </div>
    </div>
  `,
  styles: [`.booking-form { margin-bottom:12px } .actions button { margin-right:8px }`]
})
export class BookingForm implements OnChanges {
  @Input() booking?: Booking | null;
  @Output() saved = new EventEmitter<Booking>();
  @Output() closed = new EventEmitter<void>();

  isEdit = false;
  units: any[] = [];
  formUnitId?: number;
  formClientName: string = '';
  formBookingStart?: Date;
  formBookingEnd?: Date;
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

  private loadFromInput() {
    if (this.booking) {
      this.isEdit = true;
      this.formUnitId = this.booking.unit?.id;
      this.formClientName = this.booking.clientName;
      this.formBookingStart = new Date(this.booking.bookingStart);
      this.formBookingEnd = new Date(this.booking.bookingEnd);
      this.formError = '';
    } else {
      this.isEdit = false;
      this.formUnitId = undefined;
      this.formClientName = '';
      this.formBookingStart = undefined;
      this.formBookingEnd = undefined;
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
    if ((this.isEdit && this.formClientName == null) || this.formClientName.length == 0) {
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
        // PATCH only sends fields that are being updated; include vin if changed
        clientName: this.formClientName || null,
        unit: this.formUnitId || null,
        bookingStart: this.formBookingStart || null,
        bookingEnd: this.formBookingEnd || null
      };
      this.bookingService.patchBooking(this.booking.id, patchPayload).subscribe({
        next: b => { this.notif.showSuccess('Booking updated'); this.saved.emit(b); },
        error: e => { console.error(e); this.notif.showError('Error updating booking'); }
      });
    } else {
      const createPayload: any = {
        clientName: this.formClientName,
        unit: this.formUnitId,
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
