package ee.vehicleBooking.vehicleBooking.service;

import ee.vehicleBooking.vehicleBooking.model.Vehicle;
import ee.vehicleBooking.vehicleBooking.repository.VehicleRepository;
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
class VehicleServiceTest {
    @Mock
    private VehicleRepository vehicleRepository;

    @InjectMocks
    private VehicleService vehicleService;

    @Test
    void getAll() {
        List<Vehicle> mockList = List.of(new Vehicle(), new Vehicle());
        Mockito.when(vehicleRepository.findAll()).thenReturn(mockList);
        assertEquals(mockList, vehicleService.getAll());
    }

    @Test
    void getById() {
        Mockito.when(vehicleRepository.findById(1L)).thenReturn(Optional.of(utils.vehicle1));
        Mockito.when(vehicleRepository.findById(2L)).thenThrow(EntityNotFoundException.class);
        assertEquals(utils.vehicle1, vehicleService.getById(1L));
        assertThrows(EntityNotFoundException.class, () -> vehicleService.getById(2L));
    }

    @Test
    void save() {
        Mockito.when(vehicleRepository.save(utils.vehicle1)).thenReturn(utils.vehicle1);
        assertEquals(utils.vehicle1, vehicleService.save(utils.vehicle1));
    }
}