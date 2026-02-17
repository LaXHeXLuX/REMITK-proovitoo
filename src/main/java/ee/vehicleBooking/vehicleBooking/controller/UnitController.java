package ee.vehicleBooking.vehicleBooking.controller;

import ee.vehicleBooking.vehicleBooking.model.Unit;
import ee.vehicleBooking.vehicleBooking.service.UnitService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/units")
public class UnitController {
    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    @GetMapping
    public List<Unit> getAllUnits() {
        return unitService.getAllUnits();
    }

    @GetMapping("/available")
    public List<Unit> getAvailableUnits() {
        return unitService.getAvailableUnits();
    }
}
