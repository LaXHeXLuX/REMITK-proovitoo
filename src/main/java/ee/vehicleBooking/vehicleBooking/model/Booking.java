package ee.vehicleBooking.vehicleBooking.model;

import jakarta.persistence.*;
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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "unit_id", nullable = false)
    private Unit unit;

    @Column(name = "booking_start", nullable = false)
    private LocalDateTime bookingStart;

    @Column(name = "booking_end", nullable = false)
    private LocalDateTime bookingEnd;

    @Column(nullable = false)
    private Boolean paid;
}