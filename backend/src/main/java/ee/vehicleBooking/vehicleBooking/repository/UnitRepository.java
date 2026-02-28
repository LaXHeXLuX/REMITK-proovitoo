package ee.vehicleBooking.vehicleBooking.repository;

import ee.vehicleBooking.vehicleBooking.model.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {
    @Query("SELECT u FROM Unit u WHERE u.bookable = true")
    List<Unit> findBookable();
}
