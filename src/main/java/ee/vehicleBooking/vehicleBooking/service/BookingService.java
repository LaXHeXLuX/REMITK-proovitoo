package ee.vehicleBooking.vehicleBooking.service;

import ee.vehicleBooking.vehicleBooking.model.Booking;
import ee.vehicleBooking.vehicleBooking.repository.BookingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class BookingService {
    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public List<Booking> getAll() {
        return bookingRepository.findAll();
    }

    public List<Booking> getClientBookings(Long clientId) {
        return bookingRepository.findByClientId(clientId);
    }

    @Transactional
    public Booking createBooking(Booking booking) {
        // business rules
        return bookingRepository.save(booking);
    }
}