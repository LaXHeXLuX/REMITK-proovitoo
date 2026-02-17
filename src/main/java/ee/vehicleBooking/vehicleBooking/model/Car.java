package ee.vehicleBooking.vehicleBooking.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "cars", schema = "vehicle_booking")
@Getter
@Setter
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String company;

    @Column(name = "number_of_seats", nullable = false)
    private Integer numberOfSeats;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private FuelType fuel;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private TransmissionType transmission;

    @Column(nullable = false)
    private Integer year;
}