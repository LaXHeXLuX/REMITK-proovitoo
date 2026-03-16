import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UnitService } from '../../services/unit';
import { Unit } from '../../models/unit';
import { NotificationService } from '../../services/notification.service';
import { UnitForm } from '../unit-form/unit-form';
import { matchUnit } from '../../utils';

@Component({
	selector: 'app-unit-list',
	standalone: true,
	imports: [CommonModule, UnitForm, FormsModule],
	templateUrl: './unit-list.html',
	styleUrls: ['../data-list.css']
})
export class UnitList implements OnInit {
	units: Unit[] = [];
	showOnlyBookable = false;
	searchText: string = '';
	showForm = false;
	selectedUnit?: Unit | null = null;

	constructor(private unitService: UnitService, private cdr: ChangeDetectorRef, private notif: NotificationService) { }

	ngOnInit(): void {
		this.loadUnits();
	}

	loadUnits(): void {
		this.unitService.getUnits().subscribe({
			next: (data) => {
				this.units = data;
				this.cdr.detectChanges();
			},
			error: (err) => console.error('Error loading units', err),
		});
	}

	get filtered(): Unit[] {
		let filteredUnits = this.units;
		if (this.showOnlyBookable) {
			filteredUnits = filteredUnits.filter((u) => u.bookable);
		}
		const term = this.searchText?.toLowerCase().trim();
		if (term) {
			filteredUnits = filteredUnits.filter((u) => matchUnit(term, u))
		}
		return filteredUnits;
	}

	deleteUnit(id?: number): void {
		if (!id) return;
		if (!confirm('Delete this unit?')) return;
		this.unitService.deleteUnit(id).subscribe({
			next: () => this.loadUnits(),
			error: (err) => console.error('Error deleting unit', err),
		});
	}

	openCreate(): void { this.selectedUnit = null; this.showForm = true; }
	openEdit(u: Unit): void { this.selectedUnit = u; this.showForm = true; }
	onSaved(_: Unit): void { this.showForm = false; this.loadUnits(); }
	onClosed(): void { this.showForm = false; }
}
