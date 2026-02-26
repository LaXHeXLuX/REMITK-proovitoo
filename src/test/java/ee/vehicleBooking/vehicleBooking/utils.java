package ee.vehicleBooking.vehicleBooking;

import ee.vehicleBooking.vehicleBooking.model.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class utils {
    public static final Vehicle vehicle1 = vehicle("A1", "BestCar", 5, FuelType.electric, TransmissionType.automatic, 2026);
    public static final Vehicle vehicle2 = vehicle("Z0", "WorstCar", 2, FuelType.diesel, TransmissionType.manual, 2000);

    public static final Client client1 = client("Alice Adams", LocalDate.of(2000, 1, 1));
    public static final Client client2 = client("Bob Bucket", LocalDate.of(1950, 5, 5));

    public static final Unit unit1_1 = unit(utils.vehicle1, true, "123ABC", BigDecimal.valueOf(200));
    public static final Unit unit1_2 = unit(utils.vehicle1, false, null, null);
    public static final Unit unit2_1 = unit(utils.vehicle2, true, "OLD1", BigDecimal.valueOf(20));

    public static final Booking booking1 = booking(
            utils.client1,
            utils.unit1_1,
            LocalDateTime.now(),
            LocalDateTime.now().plusDays(1),
            false
    );
    public static final Booking booking2 = booking(
            utils.client1,
            utils.unit1_2,
            LocalDateTime.now().plusDays(2),
            LocalDateTime.now().plusDays(5),
            false
    );

    public static Vehicle vehicle(String name, String company, int numberOfSeats, FuelType fuel, TransmissionType transmission, int year) {
        Vehicle vehicle = new Vehicle();
        vehicle.setName(name);
        vehicle.setCompany(company);
        vehicle.setNumberOfSeats(numberOfSeats);
        vehicle.setFuel(fuel);
        vehicle.setTransmission(transmission);
        vehicle.setYear(year);
        return vehicle;
    }

    public static Unit unit(Vehicle vehicle, boolean bookable, String licencePlate, BigDecimal pricePerDay) {
        Unit unit = new Unit();
        unit.setVehicle(vehicle);
        unit.setBookable(bookable);
        unit.setLicencePlate(licencePlate);
        unit.setPricePerDay(pricePerDay);
        return unit;
    }

    public static Client client(String name, LocalDate birthDate) {
        Client client = new Client();
        client.setName(name);
        client.setBirthDate(birthDate);
        return client;
    }

    public static Booking booking(Client client, Unit unit, LocalDateTime bookingStart, LocalDateTime bookingEnd, boolean paid) {
        Booking booking = new Booking();
        booking.setClient(client);
        booking.setUnit(unit);
        booking.setBookingStart(bookingStart);
        booking.setBookingEnd(bookingEnd);
        booking.setPaid(paid);
        return booking;
    }
}
