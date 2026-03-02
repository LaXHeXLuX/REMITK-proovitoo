import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NotificationComponent } from './components/notification/notification';

@Component({
	selector: 'app-root',
	imports: [
		RouterOutlet,
		RouterLink,
		RouterLinkActive,
		NotificationComponent
	],
	templateUrl: './app.html',
	styleUrls: ['./app.css']
})
export class App {
	protected readonly title = signal('vehicle-booking-frontend');
}

