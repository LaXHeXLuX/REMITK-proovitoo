package ee.vehicleBooking.vehicleBooking.service;

import ee.vehicleBooking.vehicleBooking.model.Client;
import ee.vehicleBooking.vehicleBooking.repository.ClientRepository;
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
class ClientServiceTest {
    @Mock
    private ClientRepository clientRepository;

    @InjectMocks
    private ClientService clientService;

    @Test
    void getAll() {
        List<Client> mockList = List.of(new Client(), new Client());
        Mockito.when(clientRepository.findAll()).thenReturn(mockList);
        assertEquals(mockList, clientService.getAll());
    }

    @Test
    void getById() {
        Mockito.when(clientRepository.findById(1L)).thenReturn(Optional.of(utils.client1));
        Mockito.when(clientRepository.findById(2L)).thenThrow(EntityNotFoundException.class);
        assertEquals(utils.client1, clientService.getById(1L));
        assertThrows(EntityNotFoundException.class, () -> clientService.getById(2L));
    }

    @Test
    void save() {
        Mockito.when(clientRepository.save(utils.client1)).thenReturn(utils.client1);
        assertEquals(utils.client1, clientService.save(utils.client1));
    }
}