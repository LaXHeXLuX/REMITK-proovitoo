package ee.vehicleBooking.vehicleBooking.dto;

import ee.vehicleBooking.vehicleBooking.model.Car;

import java.math.BigDecimal;

public record UnitResponseDTO(
        Long id,
        Car car,
        Boolean bookable,
        String licencePlate,
        BigDecimal pricePerDay
) {}