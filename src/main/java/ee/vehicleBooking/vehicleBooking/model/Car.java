package ee.vehicleBooking.vehicleBooking.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "cars", schema = "vehicle_booking")
@Getter
@Setter
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotNull(message = "Car must have a name (key: name)")
    private String name;

    @Column(nullable = false)
    @NotNull(message = "Car must have a company (key: company)")
    private String company;

    @Column(name = "number_of_seats", nullable = false)
    @NotNull(message = "Car must have a number of seats (key: numberOfSeats)")
    private Integer numberOfSeats;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    @NotNull(message = "Car must have a fuel type (key: fuel)")
    private FuelType fuel;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    @NotNull(message = "Car must have a transmission type (key: transmission)")
    private TransmissionType transmission;

    @Column(nullable = false)
    @NotNull(message = "Car must have a production year (key: year)")
    private Integer year;
}