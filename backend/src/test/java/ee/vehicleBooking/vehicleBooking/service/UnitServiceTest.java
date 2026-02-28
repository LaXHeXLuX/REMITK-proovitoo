package ee.vehicleBooking.vehicleBooking.service;

import ee.vehicleBooking.vehicleBooking.model.Unit;
import ee.vehicleBooking.vehicleBooking.repository.UnitRepository;
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
class UnitServiceTest {
    @Mock
    private UnitRepository unitRepository;

    @InjectMocks
    private UnitService unitService;

    @Test
    void getAll() {
        List<Unit> mockList = List.of(new Unit(), new Unit());
        Mockito.when(unitRepository.findAll()).thenReturn(mockList);
        assertEquals(mockList, unitService.getAll());
    }

    @Test
    void getById() {
        Mockito.when(unitRepository.findById(1L)).thenReturn(Optional.of(utils.unit1_1));
        Mockito.when(unitRepository.findById(2L)).thenThrow(EntityNotFoundException.class);
        assertEquals(utils.unit1_1, unitService.getById(1L));
        assertThrows(EntityNotFoundException.class, () -> unitService.getById(2L));
    }

    @Test
    void getBookable() {
        Mockito.when(unitRepository.findById(1L)).thenReturn(Optional.of(utils.unit1_1));
        Mockito.when(unitRepository.findById(2L)).thenThrow(EntityNotFoundException.class);
        assertEquals(utils.unit1_1, unitService.getById(1L));
        assertThrows(EntityNotFoundException.class, () -> unitService.getById(2L));
    }

    @Test
    void save() {
        Mockito.when(unitRepository.save(utils.unit1_1)).thenReturn(utils.unit1_1);
        assertEquals(utils.unit1_1, unitRepository.save(utils.unit1_1));
    }
}