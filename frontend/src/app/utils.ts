import { Vehicle } from "./models/vehicle";
import { Unit } from "./models/unit";
import { Booking } from "./models/booking";

export function matchVehicle(term: string, v: Vehicle): boolean {
	return v.name.toLowerCase().includes(term) ||
		v.company.toLowerCase().includes(term) ||
		String(v.year).includes(term);
}

export function matchUnit(term: string, u: Unit): boolean {
	return u.vin.toLowerCase().includes(term) ||
		u.licencePlate?.toLowerCase().includes(term) ||
		matchVehicle(term, u.vehicle);
}

export function matchBooking(term: string, b: Booking): boolean {
	return b.clientName.toLowerCase().includes(term) ||
		matchUnit(term, b.unit);
}