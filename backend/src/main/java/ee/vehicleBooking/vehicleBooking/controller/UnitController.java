package ee.vehicleBooking.vehicleBooking.controller;

import ee.vehicleBooking.vehicleBooking.model.Unit;
import ee.vehicleBooking.vehicleBooking.service.UnitService;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/units")
public class UnitController {
    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    @GetMapping
    public List<Unit> getAll() {
        return unitService.getAll();
    }

    @GetMapping("/bookable")
    public List<Unit> getBookable() {
        return unitService.getBookable();
    }

    @GetMapping("/available")
    public ResponseEntity<List<Unit>> getAvailableDuring(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end
    ) {
        if (start.isAfter(end)) {
            return ResponseEntity.badRequest().build();
        }

        List<Unit> units = unitService.getAvailableDuring(start, end);
        return ResponseEntity.ok(units);
    }

    @PostMapping
    public ResponseEntity<Unit> create(@Valid @RequestBody Unit unit) {
        return ResponseEntity.status(HttpStatus.CREATED).body(unitService.save(unit));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Unit> patch(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        return ResponseEntity.ok(unitService.patch(id, updates));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        unitService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
