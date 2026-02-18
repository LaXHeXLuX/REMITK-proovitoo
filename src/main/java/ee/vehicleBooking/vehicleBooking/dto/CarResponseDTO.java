package ee.vehicleBooking.vehicleBooking.dto;

public record CarResponseDTO(
        Long id,
        String name,
        String company,
        Integer numberOfSeats,
        String fuel,
        String transmission,
        Integer year
) {}