package ee.vehicleBooking.vehicleBooking.repository;

import ee.vehicleBooking.vehicleBooking.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
}
