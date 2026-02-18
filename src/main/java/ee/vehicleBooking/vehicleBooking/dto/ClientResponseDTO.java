package ee.vehicleBooking.vehicleBooking.dto;

import java.time.LocalDate;

public record ClientResponseDTO(
        Long id,
        String name,
        LocalDate birthDate
) {}