package ee.vehicleBooking.vehicleBooking.dto;

import lombok.Getter;
import lombok.Setter;
import org.openapitools.jackson.nullable.JsonNullable;

import java.time.LocalDate;

@Getter
@Setter
public final class ClientPatchDTO {
    private JsonNullable<String> name = JsonNullable.undefined();
    private JsonNullable<LocalDate> birthDate = JsonNullable.undefined();
}