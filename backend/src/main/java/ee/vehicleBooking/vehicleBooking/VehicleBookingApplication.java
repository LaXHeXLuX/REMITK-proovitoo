package ee.vehicleBooking.vehicleBooking;

import ee.vehicleBooking.vehicleBooking.repository.UnitRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class VehicleBookingApplication {

	static void main(String[] args) {
		SpringApplication.run(VehicleBookingApplication.class, args);
	}

    @Bean
    public CommandLineRunner seedData(UnitRepository unitRepository) {
        return _ -> System.out.println("Up and running! Current unit count: " + unitRepository.count());
    }
}
