import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
	id: number;
	type: 'success' | 'error' | 'info';
	message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
	private seq = 1;
	private subject = new BehaviorSubject<Notification[]>([]);
	public readonly notifications$ = this.subject.asObservable();

	show(message: string, type: Notification['type'] = 'info') {
		const note: Notification = { id: this.seq++, type, message };
		const current = this.subject.getValue();
		this.subject.next([...current, note]);
		// auto-dismiss
		setTimeout(() => this.dismiss(note.id), 6000);
	}

	showSuccess(message: string) { this.show(message, 'success'); }
	showError(message: string) { this.show(message, 'error'); }

	dismiss(id: number) {
		const next = this.subject.getValue().filter(n => n.id !== id);
		this.subject.next(next);
	}
}
