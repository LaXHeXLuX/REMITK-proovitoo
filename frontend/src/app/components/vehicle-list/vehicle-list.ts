import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle } from '../../models/vehicle';
import { VehicleService } from '../../services/vehicle';
import { NotificationService } from '../../services/notification.service';
import { VehicleForm } from '../vehicle-form/vehicle-form';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, VehicleForm],
  templateUrl: './vehicle-list.html',
  styleUrls: ['./vehicle-list.css'],
})
export class VehicleList implements OnInit {
  vehicles: Vehicle[] = [];
  searchTerm: string = '';

  // form host
  showForm = false;
  selectedVehicle?: Vehicle | null = null;

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

  openCreate(): void { this.selectedVehicle = null; this.showForm = true; }
  openEdit(v: Vehicle): void { this.selectedVehicle = v; this.showForm = true; }
  onSaved(_: Vehicle): void { this.showForm = false; this.loadVehicles(); }
  onClosed(): void { this.showForm = false; }
}