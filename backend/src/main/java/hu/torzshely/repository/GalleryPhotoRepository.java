package hu.torzshely.repository;

import hu.torzshely.model.GalleryPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GalleryPhotoRepository extends JpaRepository<GalleryPhoto, Long> {
    List<GalleryPhoto> findByActiveTrueOrderBySortOrderAsc();
    List<GalleryPhoto> findByActiveTrue();
    List<GalleryPhoto> findByCategoryAndActiveTrueOrderBySortOrderAsc(String category);
}
