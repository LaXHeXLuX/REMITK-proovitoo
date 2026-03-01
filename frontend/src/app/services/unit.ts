import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Unit } from '../models/unit';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  private apiUrl = '/api/units';

  constructor(private http: HttpClient) {}

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.apiUrl);
  }

  getBookableUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(`${this.apiUrl}/bookable`);
  }

  createUnit(unit: Unit): Observable<Unit> {
    return this.http.post<Unit>(this.apiUrl, unit);
  }

  patchUnit(id: number, updates: Partial<Unit>): Observable<Unit> {
    return this.http.patch<Unit>(`${this.apiUrl}/${id}`, updates);
  }

  deleteUnit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
