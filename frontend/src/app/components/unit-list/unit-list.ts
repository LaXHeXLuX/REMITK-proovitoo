import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnitService } from '../../services/unit';
import { Unit } from '../../models/unit';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-unit-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unit-list.html',
  styleUrls: ['./unit-list.css'],
})
export class UnitList implements OnInit {
  units: Unit[] = [];
  showOnlyBookable = false;

  constructor(private unitService: UnitService, private cdr: ChangeDetectorRef, private notif: NotificationService) {}

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
    if (!this.showOnlyBookable) return this.units;
    return this.units.filter((u) => u.bookable);
  }

  deleteUnit(id?: number): void {
    if (!id) return;
    if (!confirm('Delete this unit?')) return;
    this.unitService.deleteUnit(id).subscribe({
      next: () => this.loadUnits(),
      error: (err) => console.error('Error deleting unit', err),
    });
  }

  addUnitPlaceholder(): void {
    this.notif.show('Add Unit form not implemented yet — extracting form next', 'info');
  }
}
