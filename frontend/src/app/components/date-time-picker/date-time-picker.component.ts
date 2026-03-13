import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const hourStart = 8;
const hourEnd = 20;
const minuteInterval = 15;

@Component({
    selector: 'app-date-time-picker',
    standalone: true,
    imports: [CommonModule, FormsModule],
    styles: [`
        :host { display: inline-block; vertical-align: middle; }
        .date-time-wrapper { display: inline-flex; gap: 5px; align-items: center; }
    `],
    template: `
    <div class="date-time-wrapper">
      <input type="date" 
             [(ngModel)]="dateValue" 
             (change)="emitChange()" 
             [min]="minDateString" />
             
      <select [(ngModel)]="timeValue" (change)="emitChange()">
        <option value="">--</option>
        <option *ngFor="let t of timeOptions" 
                [value]="t" 
                [disabled]="isTimeDisabled(t)">
          {{ t }}
        </option>
      </select>
    </div>
  `
})
export class DateTimePickerComponent implements OnInit, OnChanges {
    @Input() dateValue: string = '';
    @Input() timeValue: string = '';
    
    /** * Pass a string like '2026-03-14 10:30' to restrict.
     * Pass 'now' to automatically restrict to the current moment.
     * Pass null for no restriction.
     */
    @Input() minAfter: string | 'now' | null = null; 

    @Output() dateValueChange = new EventEmitter<string>();
    @Output() timeValueChange = new EventEmitter<string>();
    @Output() dateTimeChange = new EventEmitter<{ date: string, time: string }>();

    timeOptions: string[] = [];
    minDateString: string | null = null;
    calculatedMinAfter: string | null = null;

    ngOnInit() {
        this.generate15MinOptions();
        this.updateConstraints();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['minAfter']) {
            this.updateConstraints();
        }
    }

    private updateConstraints() {
        if (!this.minAfter) {
            this.minDateString = null;
            this.calculatedMinAfter = null;
            return;
        }

        if (this.minAfter === 'now') {
            this.calculatedMinAfter = this.getCurrentTimestamp();
        } else {
            this.calculatedMinAfter = this.minAfter;
        }

        this.minDateString = this.calculatedMinAfter.split(' ')[0] || this.calculatedMinAfter.split('T')[0];
    }

    private getCurrentTimestamp(): string {
        const d = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    isTimeDisabled(opt: string): boolean {
        if (!this.calculatedMinAfter || !this.dateValue) return false;

        const [minDate, minTime] = this.calculatedMinAfter.includes(' ') 
            ? this.calculatedMinAfter.split(' ') 
            : this.calculatedMinAfter.split('T');

        if (this.dateValue > minDate) return false;
        if (this.dateValue < minDate) return true;

        return this.timeToMinutes(opt) < this.timeToMinutes(minTime);
    }

    private generate15MinOptions() {
        const times = [];
        for (let h = hourStart; h <= hourEnd; h++) {
            for (let m = 0; m < 60; m += minuteInterval) {
                times.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`);
            }
        }
        this.timeOptions = times;
	}

    private timeToMinutes(t: string): number {
        if (!t) return -Infinity;
        const [hh, mm] = t.split(':').map(s => parseInt(s, 10));
        return hh * 60 + (mm || 0);
    }

    emitChange() {
        this.dateValueChange.emit(this.dateValue);
        this.timeValueChange.emit(this.timeValue);
        this.dateTimeChange.emit({ date: this.dateValue, time: this.timeValue });
    }
}