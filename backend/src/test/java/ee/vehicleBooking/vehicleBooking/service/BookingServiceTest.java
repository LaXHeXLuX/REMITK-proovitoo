package ee.vehicleBooking.vehicleBooking.service;

import ee.vehicleBooking.vehicleBooking.model.*;
import ee.vehicleBooking.vehicleBooking.repository.BookingRepository;
import ee.vehicleBooking.vehicleBooking.utils;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class BookingServiceTest {
    @Mock
    private BookingRepository bookingRepository;

    @InjectMocks
    private BookingService bookingService;

    @Test
    void getAll() {
        List<Booking> mockList = List.of(new Booking(), new Booking());
        Mockito.when(bookingRepository.findAll()).thenReturn(mockList);
        assertEquals(mockList, bookingService.getAll());
    }

    @Test
    void getById() {
        Mockito.when(bookingRepository.findById(1L)).thenReturn(Optional.of(utils.booking1));
        Mockito.when(bookingRepository.findById(2L)).thenThrow(EntityNotFoundException.class);
        assertEquals(utils.booking1, bookingService.getById(1L));
        assertThrows(EntityNotFoundException.class, () -> bookingService.getById(2L));
    }

    @Test
    void save() {
        Mockito.when(bookingRepository.save(utils.booking1)).thenReturn(utils.booking1);
        assertEquals(utils.booking1, bookingService.save(utils.booking1));

        //Mockito.when(bookingRepository.save(utils.booking2)).thenThrow(IllegalArgumentException.class);
    }
}