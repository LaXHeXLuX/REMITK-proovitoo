package ee.vehicleBooking.vehicleBooking.repository;

import ee.vehicleBooking.vehicleBooking.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
}
