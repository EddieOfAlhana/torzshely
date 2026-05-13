package hu.torzshely.repository;

import hu.torzshely.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByFeaturedTrueAndActiveTrueOrderByReviewDateDesc();
    List<Review> findByActiveTrueOrderByReviewDateDesc();
}
