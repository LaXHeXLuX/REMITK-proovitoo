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
            System.out.println("Up and running! Current unit count: " + unitRepository.count());
        };
    }
}
