import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../models/vehicle';
import { VehicleService } from '../../services/vehicle';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vehicle-list.html',
  styleUrls: ['./vehicle-list.css'],
})
export class VehicleList implements OnInit {
  vehicles: Vehicle[] = [];
  searchTerm: string = '';
  // form state
  editing: boolean = false;
  editingId?: number;
  formName: string = '';
  formCompany: string = '';
  formSeats: number | null = null;
  formFuel: string = 'gasoline';
  formTransmission: string = 'manual';
  formYear: number | null = null;
  formError: string = '';

  constructor(private vehicleService: VehicleService, private cdr: ChangeDetectorRef, private notif: NotificationService) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading vehicles', err)
    });
  }

  get filteredVehicles(): Vehicle[] {
    const term = this.searchTerm?.toLowerCase().trim();
    if (!term) return this.vehicles;
    return this.vehicles.filter(v =>
      v.name.toLowerCase().includes(term) ||
      v.company.toLowerCase().includes(term) ||
      String(v.year).includes(term)
    );
  }

  deleteVehicle(id?: number): void {
    if (!id) return;
    if (!confirm('Delete this vehicle?')) return;
    this.vehicleService.deleteVehicle(id).subscribe({
      next: () => this.loadVehicles(),
      error: (err) => console.error('Error deleting vehicle', err)
    });
  }

  startCreate(): void {
    this.editing = false;
    this.editingId = undefined;
    this.formName = '';
    this.formCompany = '';
    this.formSeats = null;
    this.formFuel = 'gasoline';
    this.formTransmission = 'manual';
    this.formYear = null;
  }

  startEdit(v: Vehicle): void {
    this.editing = true;
    this.editingId = v.id;
    this.formName = v.name;
    this.formCompany = v.company;
    this.formSeats = v.numberOfSeats;
    this.formFuel = v.fuel;
    this.formTransmission = v.transmission;
    this.formYear = (v as any).year ?? null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.startCreate();
  }

  saveVehicle(): void {
    const payload: Partial<Vehicle> = {
      name: this.formName,
      company: this.formCompany,
      numberOfSeats: this.formSeats ?? 0,
      fuel: this.formFuel as any,
      transmission: this.formTransmission as any,
      year: this.formYear ?? new Date().getFullYear()
    };

    // validate seats/year when provided
    if (this.formSeats !== null && this.formSeats <= 0) {
      this.formError = 'Seats must be a positive number';
      this.notif.showError(this.formError);
      return;
    }
    if (this.formYear !== null && this.formYear <= 0) {
      this.formError = 'Year must be a positive number';
      this.notif.showError(this.formError);
      return;
    }

    if (this.editing && this.editingId) {
      this.vehicleService.patchVehicle(this.editingId, payload).subscribe({
        next: () => { this.loadVehicles(); this.cancelEdit(); },
        error: (err) => { console.error('Error updating vehicle', err); this.notif.showError('Error updating vehicle'); }
      });
    } else {
      this.vehicleService.createVehicle(payload as Vehicle).subscribe({
        next: () => { this.loadVehicles(); this.startCreate(); },
        error: (err) => { console.error('Error creating vehicle', err); this.notif.showError('Error creating vehicle'); }
      });
    }
  }
}