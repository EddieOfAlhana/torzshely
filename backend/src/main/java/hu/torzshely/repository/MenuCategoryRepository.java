package hu.torzshely.repository;

import hu.torzshely.model.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MenuCategoryRepository extends JpaRepository<MenuCategory, Long> {
    List<MenuCategory> findByActiveTrueOrderBySortOrderAsc();
    List<MenuCategory> findByTypeAndActiveTrueOrderBySortOrderAsc(String type);
}
