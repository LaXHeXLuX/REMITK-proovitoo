package ee.vehicleBooking.vehicleBooking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings", schema = "vehicle_booking")
@Getter
@Setter
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Booking must have a client name (key: clientName)")
    private String clientName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    @NotNull(message = "Booking must have a unit (key: unit)")
    private Unit unit;

    @Column(name = "booking_start", nullable = false)
    @NotNull(message = "Booking must have a start time (key: bookingStart)")
    private LocalDateTime bookingStart;

    @Column(name = "booking_end", nullable = false)
    @NotNull(message = "Booking must have an end time (key: bookingEnd)")
    private LocalDateTime bookingEnd;
}