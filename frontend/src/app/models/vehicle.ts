export type FuelType = 'diesel' | 'gasoline' | 'electric' | 'LPG';
export type TransmissionType = 'automatic' | 'manual';

export interface Vehicle {
	id?: number;
	name: string;
	company: string;
	numberOfSeats: number;
	fuel: FuelType;
	transmission: TransmissionType;
	year: number;
}

export function vehicleDescription(v: Vehicle): string {
	return `${v.company} ${v.name} ${v.year}`;
}