package ee.vehicleBooking.vehicleBooking.dto;

public record CarRequestDTO(
        String name,
        String company,
        Integer numberOfSeats,
        String fuel,
        String transmission,
        Integer year
) {}