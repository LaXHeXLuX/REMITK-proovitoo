package ee.vehicleBooking.vehicleBooking;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.hibernate.TransientPropertyValueException;
import org.postgresql.util.PSQLException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import tools.jackson.databind.exc.InvalidFormatException;
import tools.jackson.databind.exc.UnrecognizedPropertyException;

import java.time.Instant;
import java.time.format.DateTimeParseException;
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
        } else if (ex.getCause() instanceof UnrecognizedPropertyException cause) {
            message = String.format("Unrecognized property '%s'", cause.getPath().getFirst().getPropertyName());
        }

        return buildResponse(HttpStatus.BAD_REQUEST, message, request, errorList(ex));
    }

    @ExceptionHandler(TransientPropertyValueException.class)
    public ResponseEntity<ApiErrorResponse> handleTransient(TransientPropertyValueException ex, HttpServletRequest request) {
        String message = String.format("Field '%s' requires a valid existing ID", ex.getPropertyName());
        return buildResponse(HttpStatus.BAD_REQUEST, message, request, errorList(ex));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolation(DataIntegrityViolationException ex, HttpServletRequest request) {
        String message = "Data integrity violation: " + ex.getMostSpecificCause().getMessage();
        return buildResponse(HttpStatus.CONFLICT, message, request, errorList(ex));
    }

    @ExceptionHandler(PSQLException.class)
    public ResponseEntity<ApiErrorResponse> handlePSQLException(PSQLException ex, HttpServletRequest request) {
        String message = "PSQL exception: " + ex.getMessage();
        return buildResponse(HttpStatus.CONFLICT, message, request, errorList(ex));
    }

    @ExceptionHandler(ClassCastException.class)
    public ResponseEntity<ApiErrorResponse> handleClassCast(ClassCastException ex, HttpServletRequest request) {
        String message = "Class cast exception: " + ex.getMessage();
        return buildResponse(HttpStatus.BAD_REQUEST, message, request, errorList(ex));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolation(ConstraintViolationException ex, HttpServletRequest request) {
        List<String> violations = new ArrayList<>();
        for (ConstraintViolation<?> constraintViolation : ex.getConstraintViolations()) {
            violations.add(constraintViolation.getMessage());
        }
        String message = "Constraint violations: " + violations;
        return buildResponse(HttpStatus.CONFLICT, message, request, errorList(ex));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        String message = "Illegal argument: " + ex.getMessage();
        return buildResponse(HttpStatus.BAD_REQUEST, message, request, errorList(ex));
    }

    @ExceptionHandler(DateTimeParseException.class)
    public ResponseEntity<ApiErrorResponse> handleDateTimeParse(DateTimeParseException ex, HttpServletRequest request) {
        String message = "Date time parse exception: " + ex.getMessage();
        return buildResponse(HttpStatus.BAD_REQUEST, message, request, errorList(ex));
    }

    private static List<String> errorList(Exception ex) {
        List<String> errors = new ArrayList<>();
        errors.add(ex.getClass().toString());
        Throwable cause = ex.getCause();
        while (cause != null) {
            errors.add(cause.getClass().toString());
            cause = cause.getCause();
        }

        return errors;
    }

    private static ResponseEntity<ApiErrorResponse> buildResponse(HttpStatus status, String message, HttpServletRequest request, List<String> errors) {
        ApiErrorResponse response = new ApiErrorResponse(
                Instant.now().toString(),
                message,
                request.getRequestURI(),
                errors
        );
        return new ResponseEntity<>(response, status);
    }
}