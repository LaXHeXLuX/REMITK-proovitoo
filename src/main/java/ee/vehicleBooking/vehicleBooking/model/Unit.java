package ee.vehicleBooking.vehicleBooking.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "units", schema = "vehicle_booking")
@Getter
@Setter
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    @NotNull(message = "Unit must have a vehicle (key: vehicle)")
    private Vehicle vehicle;

    @Column(nullable = false)
    private Boolean bookable = true;

    @Column(name = "licence_plate", length = 20)
    private String licencePlate;

    @Column(name = "price_per_day")
    private BigDecimal pricePerDay;
}