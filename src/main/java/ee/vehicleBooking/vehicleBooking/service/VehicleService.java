package ee.vehicleBooking.vehicleBooking.service;

import ee.vehicleBooking.vehicleBooking.model.Vehicle;
import ee.vehicleBooking.vehicleBooking.model.FuelType;
import ee.vehicleBooking.vehicleBooking.model.TransmissionType;
import ee.vehicleBooking.vehicleBooking.repository.VehicleRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class VehicleService {
    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAll() {
        return vehicleRepository.findAll();
    }

    public Vehicle getById(Long id) {
        return vehicleRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));
    }

    @Transactional
    public Vehicle save(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public void delete(Long id) {
        vehicleRepository.deleteById(id);
    }

    @Transactional
    public Vehicle patch(Long id, Map<String, Object> updates) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehicle not found"));

        updates.forEach((key, value) -> {
            switch (key) {
                case "name" -> vehicle.setName((String) value);
                case "company" -> vehicle.setCompany((String) value);
                case "numberOfSeats" -> vehicle.setNumberOfSeats((Integer) value);
                case "fuel" -> vehicle.setFuel(FuelType.valueOf((String) value));
                case "transmission" -> vehicle.setTransmission(TransmissionType.valueOf((String) value));
                case "year" -> vehicle.setYear((Integer) value);
                default -> throw new IllegalArgumentException("Field '" + key + "' is not a valid updatable field.");
            }
        });

        return vehicleRepository.save(vehicle);
    }
}
