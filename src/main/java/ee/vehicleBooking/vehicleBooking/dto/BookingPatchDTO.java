package ee.vehicleBooking.vehicleBooking.dto;

import java.time.LocalDateTime;

public record BookingPatchDTO(
        Long unitId,
        LocalDateTime start,
        LocalDateTime end,
        Boolean paid
) {}