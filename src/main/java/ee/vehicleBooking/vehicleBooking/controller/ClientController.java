package ee.vehicleBooking.vehicleBooking.controller;

import ee.vehicleBooking.vehicleBooking.model.Client;
import ee.vehicleBooking.vehicleBooking.service.ClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clients")
public class ClientController {
    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping
    public List<Client> getAll() {
        return clientService.getAll();
    }

    @PostMapping
    public ResponseEntity<Client> create(@RequestBody Client client) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.save(client));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Client> patch(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(clientService.patch(id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
