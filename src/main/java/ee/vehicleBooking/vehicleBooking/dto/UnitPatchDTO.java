package ee.vehicleBooking.vehicleBooking.dto;

import lombok.Getter;
import lombok.Setter;
import org.openapitools.jackson.nullable.JsonNullable;

import java.math.BigDecimal;

@Getter
@Setter
public final class UnitPatchDTO {
    private Boolean bookable;
    private JsonNullable<String> licencePlate = JsonNullable.undefined();
    private JsonNullable<BigDecimal> pricePerDay = JsonNullable.undefined();
}