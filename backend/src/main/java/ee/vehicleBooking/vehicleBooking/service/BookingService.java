package ee.vehicleBooking.vehicleBooking.service;

import ee.vehicleBooking.vehicleBooking.model.Booking;
import ee.vehicleBooking.vehicleBooking.model.Unit;
import ee.vehicleBooking.vehicleBooking.repository.BookingRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UnitService unitService;

    public BookingService(BookingRepository bookingRepository, UnitService unitService) {
        this.bookingRepository = bookingRepository;
        this.unitService = unitService;
    }

    public List<Booking> getAll() {
        return bookingRepository.findAll();
    }

    public Booking getById(Long id) {
        return bookingRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Booking not found"));
    }

    @Transactional
    public Booking save(Booking booking) {
        return bookingRepository.save(booking);
    }

    @Transactional
    public void delete(Long id) {
        bookingRepository.deleteById(id);
    }

    @Transactional
    public Booking patch(Long id, Map<String, Object> updates) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));

        updates.forEach((key, value) -> {
            switch (key) {
                case "clientName" -> booking.setClientName((String) value);
                case "unitId" -> {
                    Unit unit = null;
                    if (value != null) {
                        Long unitId = Long.valueOf((String) value);
                        unit = unitService.getById(unitId);
                    }
                    booking.setUnit(unit);
                }
                case "bookingStart" -> booking.setBookingStart(LocalDateTime.parse((String) value));
                case "bookingEnd" -> booking.setBookingEnd(LocalDateTime.parse((String) value));
                default -> throw new IllegalArgumentException("Field '" + key + "' is not a valid updatable field.");
            }
        });

        return bookingRepository.save(booking);
    }
}