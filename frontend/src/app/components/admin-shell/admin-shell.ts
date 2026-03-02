import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
	selector: 'app-admin-shell',
	standalone: true,
	imports: [CommonModule, RouterModule],
	template: `
		<div style="padding:12px;">
		<h2>Admin</h2>
		<nav>
			<a routerLink="vehicles">Vehicles</a> | <a routerLink="units">Units</a> | <a routerLink="bookings">Bookings</a>
		</nav>
		<section style="margin-top:12px;"><router-outlet></router-outlet></section>
		</div>
	`,
})
export class AdminShell { }
