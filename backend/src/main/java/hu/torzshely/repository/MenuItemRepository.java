package hu.torzshely.repository;

import hu.torzshely.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByCategoryIdAndActiveTrueOrderBySortOrderAsc(Long categoryId);
    List<MenuItem> findByFeaturedTrueAndActiveTrueOrderBySortOrderAsc();
}
