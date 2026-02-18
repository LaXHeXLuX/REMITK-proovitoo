package ee.vehicleBooking.vehicleBooking.dto;

import java.math.BigDecimal;

public record UnitRequestDTO(
        Long carId,
        Boolean bookable,
        String licencePlate,
        BigDecimal pricePerDay
) {}