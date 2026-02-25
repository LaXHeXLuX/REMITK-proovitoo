package ee.vehicleBooking.vehicleBooking;

import ee.vehicleBooking.vehicleBooking.model.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class utils {
    public static final Car car1 = car("A1", "BestCar", 5, FuelType.electric, TransmissionType.automatic, 2026);
    public static final Car car2 = car("Z0", "WorstCar", 2, FuelType.diesel, TransmissionType.manual, 2000);

    public static final Client client1 = client("Alice Adams", LocalDate.of(2000, 1, 1));
    public static final Client client2 = client("Bob Bucket", LocalDate.of(1950, 5, 5));

    public static final Unit unit1_1 = unit(utils.car1, true, "123ABC", BigDecimal.valueOf(200));
    public static final Unit unit1_2 = unit(utils.car1, false, null, null);
    public static final Unit unit2_1 = unit(utils.car2, true, "OLD1", BigDecimal.valueOf(20));

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

    public static Car car(String name, String company, int numberOfSeats, FuelType fuel, TransmissionType transmission, int year) {
        Car car = new Car();
        car.setName(name);
        car.setCompany(company);
        car.setNumberOfSeats(numberOfSeats);
        car.setFuel(fuel);
        car.setTransmission(transmission);
        car.setYear(year);
        return car;
    }

    public static Unit unit(Car car, boolean bookable, String licencePlate, BigDecimal pricePerDay) {
        Unit unit = new Unit();
        unit.setCar(car);
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
