import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
	selector: 'app-notification',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './notification.html',
	styleUrls: ['./notification.css']
})
export class NotificationComponent {
	constructor(public notif: NotificationService) { }
	dismiss(id: number) { this.notif.dismiss(id); }
}
