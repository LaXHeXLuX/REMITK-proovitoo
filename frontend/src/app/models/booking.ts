import { Unit } from "./unit";

export interface Booking {
  id?: number;
  clientName: string;
  unit: Unit;
  bookingStart: Date;
  bookingEnd: Date;
}
