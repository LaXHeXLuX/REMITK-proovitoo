package ee.vehicleBooking.vehicleBooking.dto;

import ee.vehicleBooking.vehicleBooking.model.Client;
import ee.vehicleBooking.vehicleBooking.model.Unit;

import java.time.LocalDateTime;

public record BookingResponseDTO(
        Long id,
        Unit unit,
        Client client,
        LocalDateTime start,
        LocalDateTime end,
        Boolean paid
) {}