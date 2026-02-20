package ee.vehicleBooking.vehicleBooking.service;

import ee.vehicleBooking.vehicleBooking.model.Car;
import ee.vehicleBooking.vehicleBooking.model.Unit;
import ee.vehicleBooking.vehicleBooking.repository.UnitRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class UnitService {
    private final UnitRepository unitRepository;
    private final CarService carService;

    public UnitService(UnitRepository unitRepository, CarService carService) {
        this.unitRepository = unitRepository;
        this.carService = carService;
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
                .orElseThrow(() -> new EntityNotFoundException("Client not found"));

        updates.forEach((key, value) -> {
            switch (key) {
                case "carId" -> {
                    Long carId = Long.valueOf((String) value);
                    Car car = carService.getById(carId);
                    unit.setCar(car);
                }
                case "bookable" -> unit.setBookable((Boolean) value);
                case "licencePlate" -> unit.setLicencePlate((String) value);
                case "pricePerDay" -> unit.setPricePerDay((BigDecimal) value);
            }
        });

        return unitRepository.save(unit);
    }
}
