import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vehicle } from '../models/vehicle';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class VehicleService {
	private apiUrl = '/api/vehicles';

	constructor(private http: HttpClient) { }

	getVehicles(): Observable<Vehicle[]> {
		return this.http.get<Vehicle[]>(this.apiUrl);
	}

	createVehicle(vehicle: Vehicle): Observable<Vehicle> {
		return this.http.post<Vehicle>(this.apiUrl, vehicle);
	}

	patchVehicle(id: number, updates: Partial<Vehicle>): Observable<Vehicle> {
		return this.http.patch<Vehicle>(`${this.apiUrl}/${id}`, updates);
	}

	deleteVehicle(id: number): Observable<void> {
		return this.http.delete<void>(`${this.apiUrl}/${id}`);
	}
}
