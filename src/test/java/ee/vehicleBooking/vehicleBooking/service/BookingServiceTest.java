package ee.vehicleBooking.vehicleBooking.service;

import ee.vehicleBooking.vehicleBooking.model.Booking;
import ee.vehicleBooking.vehicleBooking.repository.BookingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private BookingService bookingService;

    @Test
    void getAllBookings() {
        List<Booking> mockList = List.of(new Booking(), new Booking());
        Mockito.when(bookingRepository.findAll()).thenReturn(mockList);
        assertEquals(mockList, bookingService.getAllBookings());
    }

    @Test
    void getClientBookings() {
    }

    @Test
    void createBooking() {
    }
}