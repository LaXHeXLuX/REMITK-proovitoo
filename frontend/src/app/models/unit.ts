import { Vehicle } from "./vehicle";

export interface Unit {
	id?: number;
	vehicle: Vehicle;
	bookable: boolean;
	licencePlate?: string | null;
	vin: string;
	pricePerDay?: number | null;
}