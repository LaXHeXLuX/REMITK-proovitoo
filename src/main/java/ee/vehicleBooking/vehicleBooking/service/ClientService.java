package ee.vehicleBooking.vehicleBooking.service;

import ee.vehicleBooking.vehicleBooking.model.Client;
import ee.vehicleBooking.vehicleBooking.repository.ClientRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class ClientService {
    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    public List<Client> getAll() {
        return clientRepository.findAll();
    }

    public Client getById(Long id) {
        return clientRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Client not found"));
    }

    @Transactional
    public Client save(Client client) {
        return clientRepository.save(client);
    }

    @Transactional
    public void delete(Long id) {
        clientRepository.deleteById(id);
    }

    @Transactional
    public Client patch(Long id, Map<String, Object> updates) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));

        updates.forEach((key, value) -> {
            switch (key) {
                case "name" -> client.setName((String) value);
                case "birthDate" -> client.setBirthDate((LocalDate) value);
                default -> throw new IllegalArgumentException("Field '" + key + "' is not a valid updatable field.");
            }
        });

        return clientRepository.save(client);
    }
}
