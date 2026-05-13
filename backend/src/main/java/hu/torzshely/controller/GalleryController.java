package hu.torzshely.controller;

import hu.torzshely.model.GalleryPhoto;
import hu.torzshely.repository.GalleryPhotoRepository;
import hu.torzshely.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/gallery")
@RequiredArgsConstructor
public class GalleryController {

    private final GalleryPhotoRepository repo;
    private final FileStorageService fileStorage;

    @GetMapping
    public List<GalleryPhoto> all() {
        return repo.findByActiveTrue();
    }

    @GetMapping("/category/{category}")
    public List<GalleryPhoto> byCategory(@PathVariable String category) {
        return repo.findByCategoryAndActiveTrueOrderBySortOrderAsc(category);
    }

    @PostMapping
    public ResponseEntity<GalleryPhoto> upload(@RequestParam("file") MultipartFile file,
                                               @RequestParam(value = "captionHu", required = false) String captionHu,
                                               @RequestParam(value = "captionEn", required = false) String captionEn,
                                               @RequestParam(value = "category", defaultValue = "general") String category) {
        String url = fileStorage.store(file);
        GalleryPhoto photo = GalleryPhoto.builder()
                .imageUrl(url).captionHu(captionHu).captionEn(captionEn)
                .category(category).active(true).build();
        return ResponseEntity.ok(repo.save(photo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GalleryPhoto> update(@PathVariable Long id, @RequestBody GalleryPhoto updated) {
        return repo.findById(id).map(p -> {
            p.setCaptionHu(updated.getCaptionHu());
            p.setCaptionEn(updated.getCaptionEn());
            p.setCategory(updated.getCategory());
            p.setSortOrder(updated.getSortOrder());
            p.setFeatured(updated.getFeatured());
            p.setActive(updated.getActive());
            return ResponseEntity.ok(repo.save(p));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.findById(id).ifPresent(p -> {
            fileStorage.delete(p.getImageUrl());
            repo.delete(p);
        });
        return ResponseEntity.ok().build();
    }
}
