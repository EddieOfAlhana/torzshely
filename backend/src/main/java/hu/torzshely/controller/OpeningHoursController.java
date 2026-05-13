package hu.torzshely.controller;

import hu.torzshely.model.OpeningHours;
import hu.torzshely.repository.OpeningHoursRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/opening-hours")
@RequiredArgsConstructor
public class OpeningHoursController {

    private final OpeningHoursRepository repo;

    @GetMapping
    public List<OpeningHours> all() {
        return repo.findAllByOrderByDayOfWeekAsc();
    }

    @PutMapping("/{dayOfWeek}")
    public ResponseEntity<OpeningHours> update(@PathVariable Integer dayOfWeek, @RequestBody OpeningHours updated) {
        return repo.findByDayOfWeek(dayOfWeek).map(h -> {
            h.setOpenTime(updated.getOpenTime());
            h.setCloseTime(updated.getCloseTime());
            h.setClosed(updated.getClosed());
            h.setNoteHu(updated.getNoteHu());
            h.setNoteEn(updated.getNoteEn());
            return ResponseEntity.ok(repo.save(h));
        }).orElseGet(() -> {
            updated.setDayOfWeek(dayOfWeek);
            return ResponseEntity.ok(repo.save(updated));
        });
    }
}
