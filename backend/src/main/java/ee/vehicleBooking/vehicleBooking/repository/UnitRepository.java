package ee.vehicleBooking.vehicleBooking.repository;

import ee.vehicleBooking.vehicleBooking.model.Unit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UnitRepository extends JpaRepository<Unit, Long> {
    @Query("SELECT u FROM Unit u WHERE u.bookable = true")
    List<Unit> findBookable();

    @Query("""
            SELECT u FROM Unit u
            WHERE u.bookable = true AND NOT EXISTS (
            	SELECT 1 FROM Booking b
            	WHERE b.unit = u
            		AND b.bookingStart < :end
            		AND b.bookingEnd > :start
            )""")
    List<Unit> findAvailableDuring(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
