package ee.vehicleBooking.vehicleBooking.controller;

import ee.vehicleBooking.vehicleBooking.model.Car;
import ee.vehicleBooking.vehicleBooking.service.CarService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cars")
public class CarController {
    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public List<Car> getAll() {
        return carService.getAll();
    }

    @PostMapping
    public ResponseEntity<Car> create(@RequestBody Car car) {
        return ResponseEntity.status(HttpStatus.CREATED).body(carService.save(car));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Car> patch(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(carService.patch(id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        carService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
