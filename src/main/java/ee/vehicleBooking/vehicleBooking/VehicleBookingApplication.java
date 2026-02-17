package ee.vehicleBooking.vehicleBooking;

import ee.vehicleBooking.vehicleBooking.model.*;
import ee.vehicleBooking.vehicleBooking.repository.CarRepository;
import ee.vehicleBooking.vehicleBooking.repository.ClientRepository;
import ee.vehicleBooking.vehicleBooking.repository.UnitRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@SpringBootApplication
public class VehicleBookingApplication {

	static void main(String[] args) {
		SpringApplication.run(VehicleBookingApplication.class, args);
	}

    @Bean
    public CommandLineRunner seedData(CarRepository carRepository, UnitRepository unitRepository, ClientRepository clientRepository) {
        return _ -> {
            if (carRepository.count() > 0 || clientRepository.count() > 0) return;
            Car tesla = car("Model 3", "Tesla", 5, FuelType.elekter, TransmissionType.automaat, 2017);
            Car beetle = car("Beetle", "Volkswagen", 4, FuelType.bensiin, TransmissionType.manuaal, 1938);
            carRepository.save(tesla);
            carRepository.save(beetle);
            Unit unit1 = unit(tesla, false, null, null);
            Unit unit2 = unit(tesla, true, "999XXX", BigDecimal.valueOf(32));
            Unit unit3 = unit(beetle, true, "111III", BigDecimal.valueOf(17));
            Unit unit4 = unit(beetle, true, null, BigDecimal.valueOf(17));
            unitRepository.save(unit1);
            unitRepository.save(unit2);
            unitRepository.save(unit3);
            //unitRepository.save(unit4); // THIS VIOLATES DB CONSTRAINT
            System.out.println("Saved all units! total: " + unitRepository.count());
        };
    }

    private static Car car(String name, String company, int numberOfSeats, FuelType fuel, TransmissionType transmission, int year) {
        Car car = new Car();
        car.setName(name);
        car.setCompany(company);
        car.setNumberOfSeats(numberOfSeats);
        car.setFuel(fuel);
        car.setTransmission(transmission);
        car.setYear(year);
        return car;
    }

    private static Unit unit(Car car, boolean bookable, String licencePlate, BigDecimal pricePerDay) {
        Unit unit = new Unit();
        unit.setCar(car);
        unit.setBookable(bookable);
        unit.setLicencePlate(licencePlate);
        unit.setPricePerDay(pricePerDay);
        return unit;
    }

    private static Client client(String name, LocalDate birthDate) {
        Client client = new Client();
        client.setName(name);
        client.setBirthDate(birthDate);
        return client;
    }

    private static Booking booking(Client client, Unit unit, LocalDateTime start, LocalDateTime end, boolean paid) {
        Booking booking = new Booking();
        booking.setClient(client);
        booking.setUnit(unit);
        booking.setBookingStart(start);
        booking.setBookingEnd(end);
        booking.setPaid(paid);
        return booking;
    }
}
