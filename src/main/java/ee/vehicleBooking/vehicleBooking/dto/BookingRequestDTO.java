package ee.vehicleBooking.vehicleBooking.dto;

import java.time.LocalDateTime;

public record BookingRequestDTO(
        Long unitId,
        Long clientId,
        LocalDateTime start,
        LocalDateTime end,
        Boolean paid
) {}