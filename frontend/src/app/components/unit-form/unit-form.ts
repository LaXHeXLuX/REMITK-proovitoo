import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Unit } from '../../models/unit';
import { UnitService } from '../../services/unit';
import { VehicleService } from '../../services/vehicle';
import { NotificationService } from '../../services/notification.service';
import { VehicleDescriptionPipe } from '../../pipes/vehicle-description-pipe';

@Component({
	selector: 'app-unit-form',
	standalone: true,
	imports: [CommonModule, FormsModule, VehicleDescriptionPipe],
	templateUrl: './unit-form.html'
})
export class UnitForm implements OnChanges {
	@Input() unit?: Unit | null;
	@Output() saved = new EventEmitter<Unit>();
	@Output() closed = new EventEmitter<void>();

	isEdit = false;
	vehicles: any[] = [];
	formVehicleId?: number;
	formLicence: string = '';
	formVin: string = '';
	formPrice?: number | null = null;
	formBookable: boolean = true;
	formError = '';

	constructor(private unitService: UnitService, private vehicleService: VehicleService, private notif: NotificationService, private cdr: ChangeDetectorRef) {
		this.loadVehicles();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['unit']) this.loadFromInput();
	}

	private loadVehicles(): void {
		this.vehicleService.getVehicles().subscribe({ next: v => { this.vehicles = v; this.cdr.detectChanges(); }, error: e => console.error(e) });
	}

	private loadFromInput() {
		if (this.unit) {
			this.isEdit = true;
			this.formVehicleId = this.unit.vehicle?.id;
			this.formLicence = this.unit.licencePlate ?? '';
			this.formVin = (this.unit as any).vin ?? '';
			this.formPrice = this.unit.pricePerDay ?? null;
			this.formBookable = !!this.unit.bookable;
			this.formError = '';
		} else {
			this.isEdit = false;
			this.formVehicleId = undefined;
			this.formLicence = '';
			this.formVin = '';
			this.formPrice = null;
			this.formBookable = true;
			this.formError = '';
		}
	}

	save(): void {
		// validation
		if (!this.formVehicleId) {
			this.formError = 'Vehicle selection is required';
			this.notif.showError(this.formError);
			return;
		}
		// VIN required and must be 17 chars
		if (!this.formVin || this.formVin.trim().length !== 17) {
			this.formError = 'VIN is required and must be 17 characters';
			this.notif.showError(this.formError);
			return;
		}
		if (this.formPrice == null || this.formPrice < 0) {
			this.formError = 'Price must be >= 0';
			this.notif.showError(this.formError);
			return;
		}
		// If unit is bookable, licence plate and price must be provided
		if (this.formBookable) {
			if (!this.formLicence || !this.formLicence.trim()) {
				this.formError = 'Licence plate is required for bookable units';
				this.notif.showError(this.formError);
				return;
			}
			if (this.formPrice == null) {
				this.formError = 'Price is required for bookable units';
				this.notif.showError(this.formError);
				return;
			}
		}
		if (this.isEdit && this.unit?.id) {
			// backend PATCH accepts bookable, licencePlate, pricePerDay, vin
			const patchPayload: any = {
				// PATCH only sends fields that are being updated; include vin if changed
				licencePlate: this.formLicence || null,
				vin: this.formVin || null,
				pricePerDay: this.formPrice,
				bookable: this.formBookable,
			};
			this.unitService.patchUnit(this.unit.id, patchPayload).subscribe({
				next: u => { this.notif.showSuccess('Unit updated'); this.saved.emit(u); },
				error: e => { console.error(e); this.notif.showError('Error updating unit'); }
			});
		} else {
			const createPayload: any = {
				vehicle: { id: this.formVehicleId } as any,
				licencePlate: this.formLicence || undefined,
				vin: this.formVin,
				pricePerDay: this.formPrice,
				bookable: this.formBookable,
			};
			this.unitService.createUnit(createPayload as Unit).subscribe({
				next: u => { this.notif.showSuccess('Unit created'); this.saved.emit(u); },
				error: e => { console.error(e); this.notif.showError('Error creating unit'); }
			});
		}
	}

	cancel(): void { this.closed.emit(); }
}
