import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications" *ngIf="(notif.notifications$ | async) as notes">
      <div *ngFor="let n of notes" class="note" [class.error]="n.type==='error'" [class.success]="n.type==='success'">
        <span>{{ n.message }}</span>
        <button (click)="dismiss(n.id)">✕</button>
      </div>
    </div>
  `,
  styles: [
    `.notifications { position: fixed; right: 12px; top: 12px; width: 320px; z-index: 9999 }
     .note { background: #fff; border:1px solid #ddd; padding:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center }
     .note.error { border-left:4px solid #e53e3e }
     .note.success { border-left:4px solid #2f855a }
     .note button { background:none; border:0; cursor:pointer }
    `
  ]
})
export class NotificationComponent {
  constructor(public notif: NotificationService) {}
  dismiss(id: number) { this.notif.dismiss(id); }
}
