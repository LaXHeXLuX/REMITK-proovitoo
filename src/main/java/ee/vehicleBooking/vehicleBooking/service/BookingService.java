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

    public List<Booking> getClientBookings(Long clientId) {
        return bookingRepository.findByClientId(clientId);
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
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));

        updates.forEach((key, value) -> {
            switch (key) {
                case "unitId" -> {
                    Long unitId = Long.valueOf((String) value);
                    Unit unit = unitService.getById(unitId);
                    booking.setUnit(unit);
                }
                case "bookingStart" -> booking.setBookingStart((LocalDateTime) value);
                case "bookingEnd" -> booking.setBookingEnd((LocalDateTime) value);
                case "paid" -> booking.setPaid((Boolean) value);
            }
        });

        return bookingRepository.save(booking);
    }
}