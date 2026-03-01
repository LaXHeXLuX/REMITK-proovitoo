import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Vehicle } from '../../models/vehicle';
import { VehicleService } from '../../services/vehicle';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-vehicle-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="vehicle-form">
      <h3>{{ isEdit ? 'Edit Vehicle' : 'Add Vehicle' }}</h3>
      <div *ngIf="formError" style="color:#b91c1c; margin-bottom:8px">{{ formError }}</div>
      <div class="row"><label>
        <input placeholder="Name" [(ngModel)]="formName" />
      </label></div>
      <div class="row"><label>
        <input placeholder="Company" [(ngModel)]="formCompany" />
      </label></div>
      <div class="row"><label>
        <input type="number" placeholder="Seats" [(ngModel)]="formSeats" />
      </label></div>
      <div class="row">
        <label>
          <select [(ngModel)]="formFuel">
            <option value="diesel">diesel</option>
            <option value="gasoline">gasoline</option>
            <option value="electric">electric</option>
            <option value="LPG">LPG</option>
          </select>
        </label>
        <label>
          <select [(ngModel)]="formTransmission">
            <option value="manual">manual</option>
            <option value="automatic">automatic</option>
          </select>
        </label>
        <label>
          <input type="number" placeholder="Year" [(ngModel)]="formYear" />
        </label>
      </div>
      <div class="actions">
        <button (click)="save()">{{ isEdit ? 'Save' : 'Create' }}</button>
        <button (click)="cancel()">Cancel</button>
      </div>
    </div>
  `,
  styles: [`.vehicle-form { margin-bottom:12px } .actions button { margin-right:8px }`]
})
export class VehicleForm implements OnChanges {
  @Input() vehicle?: Vehicle | null;
  @Output() saved = new EventEmitter<Vehicle>();
  @Output() closed = new EventEmitter<void>();

  isEdit = false;
  formName = '';
  formCompany = '';
  formSeats: number | null = null;
  formFuel = 'gasoline';
  formTransmission = 'manual';
  formYear: number | null = null;
  formError = '';

  constructor(private vehicleService: VehicleService, private notif: NotificationService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['vehicle']) this.loadFromInput();
  }

  private loadFromInput() {
    if (this.vehicle) {
      this.isEdit = true;
      this.formName = this.vehicle.name;
      this.formCompany = this.vehicle.company;
      this.formSeats = this.vehicle.numberOfSeats ?? null;
      this.formFuel = this.vehicle.fuel ?? 'gasoline';
      this.formTransmission = this.vehicle.transmission ?? 'manual';
      this.formYear = (this.vehicle as any).year ?? null;
      this.formError = '';
    } else {
      this.isEdit = false;
      this.formName = '';
      this.formCompany = '';
      this.formSeats = null;
      this.formFuel = 'gasoline';
      this.formTransmission = 'manual';
      this.formYear = null;
      this.formError = '';
    }
  }

  save(): void {
    // validation: name & company required
    if (!this.formName || !this.formName.trim()) {
      this.formError = 'Name is required';
      this.notif.showError(this.formError);
      return;
    }
    if (!this.formCompany || !this.formCompany.trim()) {
      this.formError = 'Company is required';
      this.notif.showError(this.formError);
      return;
    }
    // validation: seats/year must be positive when provided
    if (this.formSeats == null || this.formSeats <= 0) {
      this.formError = 'Seats must be a positive number';
      this.notif.showError(this.formError);
      return;
    }
    if (this.formYear == null || this.formYear <= 0) {
      this.formError = 'Year must be a positive number';
      this.notif.showError(this.formError);
      return;
    }

    const payload: Partial<Vehicle> = {
      name: this.formName,
      company: this.formCompany,
      numberOfSeats: this.formSeats,
      fuel: this.formFuel as any,
      transmission: this.formTransmission as any,
      year: this.formYear
    };

    if (this.isEdit && this.vehicle?.id) {
      this.vehicleService.patchVehicle(this.vehicle.id, payload).subscribe({
        next: v => { this.notif.showSuccess('Vehicle updated'); this.saved.emit(v); },
        error: e => { console.error(e); this.notif.showError('Error updating vehicle'); }
      });
    } else {
      this.vehicleService.createVehicle(payload as Vehicle).subscribe({
        next: v => { this.notif.showSuccess('Vehicle created'); this.saved.emit(v); },
        error: e => { console.error(e); this.notif.showError('Error creating vehicle'); }
      });
    }
  }

  cancel(): void { this.closed.emit(); }
}
