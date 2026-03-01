package ee.vehicleBooking.vehicleBooking.service;

import ee.vehicleBooking.vehicleBooking.model.Unit;
import ee.vehicleBooking.vehicleBooking.repository.UnitRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class UnitService {
    private final UnitRepository unitRepository;

    public UnitService(UnitRepository unitRepository) {
        this.unitRepository = unitRepository;
    }

    public List<Unit> getAll() {
        return unitRepository.findAll();
    }

    public Unit getById(Long id) {
        return unitRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Unit not found"));
    }

    public List<Unit> getBookable() {
        return unitRepository.findBookable();
    }

    public List<Unit> getAvailableDuring(LocalDateTime start, LocalDateTime end) {
        return unitRepository.findAvailableDuring(start, end);
    }

    @Transactional
    public Unit save(Unit unit) {
        return unitRepository.save(unit);
    }

    @Transactional
    public void delete(Long id) {
        unitRepository.deleteById(id);
    }

    @Transactional
    public Unit patch(Long id, Map<String, Object> updates) {
        Unit unit = unitRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Unit not found"));

        updates.forEach((key, value) -> {
            switch (key) {
                case "vin" -> unit.setVin((String) value);
                case "bookable" -> unit.setBookable((Boolean) value);
                case "licencePlate" -> unit.setLicencePlate((String) value);
                case "pricePerDay" -> {
                    if (value != null) unit.setPricePerDay(new BigDecimal(value.toString()));
                    else unit.setPricePerDay(null);
                }
                default -> throw new IllegalArgumentException("Field '" + key + "' is not a valid updatable field.");
            }
        });

        return unitRepository.save(unit);
    }
}
