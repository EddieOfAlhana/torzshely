package hu.torzshely.controller;

import hu.torzshely.model.Event;
import hu.torzshely.repository.EventRepository;
import hu.torzshely.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventRepository repo;
    private final FileStorageService fileStorage;

    @GetMapping
    public List<Event> upcoming() {
        return repo.findByActiveTrueAndEventDateAfterOrderByEventDateAsc(LocalDateTime.now().minusHours(6));
    }

    @GetMapping("/all")
    public List<Event> all() {
        return repo.findByActiveTrueOrderByEventDateDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> one(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Event create(@RequestPart("event") Event event,
                        @RequestPart(value = "image", required = false) MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            event.setImageUrl(fileStorage.store(image));
        }
        return repo.save(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> update(@PathVariable Long id,
                                        @RequestPart("event") Event updated,
                                        @RequestPart(value = "image", required = false) MultipartFile image) {
        return repo.findById(id).map(e -> {
            e.setTitleHu(updated.getTitleHu());
            e.setTitleEn(updated.getTitleEn());
            e.setDescriptionHu(updated.getDescriptionHu());
            e.setDescriptionEn(updated.getDescriptionEn());
            e.setEventDate(updated.getEventDate());
            e.setCategory(updated.getCategory());
            e.setPriceHuf(updated.getPriceHuf());
            e.setRegistrationInfo(updated.getRegistrationInfo());
            e.setFeatured(updated.getFeatured());
            e.setActive(updated.getActive());
            if (image != null && !image.isEmpty()) {
                if (e.getImageUrl() != null) fileStorage.delete(e.getImageUrl());
                e.setImageUrl(fileStorage.store(image));
            }
            return ResponseEntity.ok(repo.save(e));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return repo.findById(id).map(e -> {
            e.setActive(false);
            repo.save(e);
            return ResponseEntity.<Void>ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
