package ee.vehicleBooking.vehicleBooking.service;

import ee.vehicleBooking.vehicleBooking.model.Car;
import ee.vehicleBooking.vehicleBooking.model.FuelType;
import ee.vehicleBooking.vehicleBooking.model.TransmissionType;
import ee.vehicleBooking.vehicleBooking.repository.CarRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class CarService {
    private final CarRepository carRepository;

    public CarService(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    public List<Car> getAll() {
        return carRepository.findAll();
    }

    public Car getById(Long id) {
        return carRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Car not found"));
    }

    @Transactional
    public Car save(Car car) {
        return carRepository.save(car);
    }

    @Transactional
    public void delete(Long id) {
        carRepository.deleteById(id);
    }

    @Transactional
    public Car patch(Long id, Map<String, Object> updates) {
        Car car = carRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Car not found"));

        updates.forEach((key, value) -> {
            switch (key) {
                case "name" -> car.setName((String) value);
                case "company" -> car.setCompany((String) value);
                case "numberOfSeats" -> car.setNumberOfSeats((Integer) value);
                case "fuel" -> car.setFuel(FuelType.valueOf((String) value));
                case "transmission" -> car.setTransmission(TransmissionType.valueOf((String) value));
                case "year" -> car.setYear((Integer) value);
            }
        });

        return carRepository.save(car);
    }
}
