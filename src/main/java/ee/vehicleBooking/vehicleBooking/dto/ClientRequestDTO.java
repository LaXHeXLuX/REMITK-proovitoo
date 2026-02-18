package ee.vehicleBooking.vehicleBooking.dto;

import java.time.LocalDate;

public record ClientRequestDTO(
        String name,
        LocalDate birthDate
) {}