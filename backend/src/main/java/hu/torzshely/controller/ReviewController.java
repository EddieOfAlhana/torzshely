package hu.torzshely.controller;

import hu.torzshely.model.Review;
import hu.torzshely.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository repo;

    @GetMapping
    public List<Review> featured() {
        return repo.findByFeaturedTrueAndActiveTrueOrderByReviewDateDesc();
    }

    @GetMapping("/all")
    public List<Review> all() {
        return repo.findByActiveTrueOrderByReviewDateDesc();
    }

    @PostMapping
    public Review create(@RequestBody Review review) {
        return repo.save(review);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Review> update(@PathVariable Long id, @RequestBody Review updated) {
        return repo.findById(id).map(r -> {
            r.setAuthorName(updated.getAuthorName());
            r.setTextHu(updated.getTextHu());
            r.setTextEn(updated.getTextEn());
            r.setRating(updated.getRating());
            r.setReviewDate(updated.getReviewDate());
            r.setSource(updated.getSource());
            r.setFeatured(updated.getFeatured());
            r.setActive(updated.getActive());
            return ResponseEntity.ok(repo.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
