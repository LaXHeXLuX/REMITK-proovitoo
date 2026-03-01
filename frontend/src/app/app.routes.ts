import { Routes } from '@angular/router';
import { VehicleList } from './components/vehicle-list/vehicle-list';
import { UnitList } from './components/unit-list/unit-list';
import { BookingList } from './components/booking-list/booking-list';
import { BookableUnits } from './components/bookable-units/bookable-units';
import { AdminShell } from './components/admin-shell/admin-shell';

export const routes: Routes = [
	// Client-facing
	{ path: '', redirectTo: 'client', pathMatch: 'full' },
	{ path: 'client', component: BookableUnits },

	// Admin-facing (reuse existing lists inside AdminShell)
	{ path: 'admin', component: AdminShell, children: [
		{ path: '', redirectTo: 'vehicles', pathMatch: 'full' },
		{ path: 'vehicles', component: VehicleList },
		{ path: 'units', component: UnitList },
		{ path: 'bookings', component: BookingList },
	]},
];
