package ee.vehicleBooking.vehicleBooking;

import jakarta.servlet.http.HttpServletRequest;
import org.hibernate.TransientPropertyValueException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import tools.jackson.databind.exc.InvalidFormatException;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {
    public record ApiErrorResponse(
            String timestamp,
            String message,
            String path,
            List<String> errors
    ) {}

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<String> errors = new ArrayList<>();

        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            String message = "Invalid value";
            if (fieldError.getDefaultMessage() != null) message = fieldError.getDefaultMessage();
            errors.add(message);
        }

        return buildResponse(HttpStatus.BAD_REQUEST, "Validation failed", request, errors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleJson(HttpMessageNotReadableException ex, HttpServletRequest request) {
        String message = "Malformed JSON request.";

        if (ex.getCause() instanceof InvalidFormatException cause) {
            message = String.format("Invalid value '%s' for field '%s'. Target type: %s",
                    cause.getValue(),
                    cause.getPath().getFirst().getPropertyName(),
                    cause.getTargetType());
        }

        return buildResponse(HttpStatus.BAD_REQUEST, message, request, List.of(HttpMessageNotReadableException.class.toString()));
    }

    @ExceptionHandler(TransientPropertyValueException.class)
    public ResponseEntity<ApiErrorResponse> handleTransient(TransientPropertyValueException ex, HttpServletRequest request) {
        String message = String.format("Field '%s' requires a valid existing ID", ex.getPropertyName());
        return buildResponse(HttpStatus.BAD_REQUEST, message, request, List.of(TransientPropertyValueException.class.toString()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest request) {
        String message = "Database constraint violation: " + ex.getMostSpecificCause().getMessage();
        return buildResponse(HttpStatus.CONFLICT, message, request, List.of(DataIntegrityViolationException.class.toString()));
    }

    private ResponseEntity<ApiErrorResponse> buildResponse(HttpStatus status, String message, HttpServletRequest request, List<String> errors) {
        ApiErrorResponse response = new ApiErrorResponse(
                Instant.now().toString(),
                message,
                request.getRequestURI(),
                errors
        );
        return new ResponseEntity<>(response, status);
    }
}