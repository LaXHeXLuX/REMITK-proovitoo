import { Pipe, PipeTransform } from '@angular/core';
import { Vehicle } from '../models/vehicle';

@Pipe({
	name: 'vehicleDesc',
	standalone: true
})
export class VehicleDescriptionPipe implements PipeTransform {
	transform(v: Vehicle | undefined): string {
		return v ? `${v.company} ${v.name} ${v.year}` : '';
	}
}