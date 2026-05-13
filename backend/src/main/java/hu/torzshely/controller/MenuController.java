package hu.torzshely.controller;

import hu.torzshely.model.MenuCategory;
import hu.torzshely.model.MenuItem;
import hu.torzshely.repository.MenuCategoryRepository;
import hu.torzshely.repository.MenuItemRepository;
import hu.torzshely.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
public class MenuController {

    private final MenuCategoryRepository catRepo;
    private final MenuItemRepository itemRepo;
    private final FileStorageService fileStorage;

    @GetMapping("/categories")
    public List<MenuCategory> categories() {
        return catRepo.findByActiveTrueOrderBySortOrderAsc();
    }

    @GetMapping("/categories/{type}")
    public List<MenuCategory> byType(@PathVariable String type) {
        return catRepo.findByTypeAndActiveTrueOrderBySortOrderAsc(type);
    }

    @PostMapping("/categories")
    public MenuCategory createCategory(@RequestBody MenuCategory cat) {
        return catRepo.save(cat);
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<MenuCategory> updateCategory(@PathVariable Long id, @RequestBody MenuCategory updated) {
        return catRepo.findById(id).map(c -> {
            c.setNameHu(updated.getNameHu());
            c.setNameEn(updated.getNameEn());
            c.setType(updated.getType());
            c.setSortOrder(updated.getSortOrder());
            c.setActive(updated.getActive());
            return ResponseEntity.ok(catRepo.save(c));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        catRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/items/featured")
    public List<MenuItem> featured() {
        return itemRepo.findByFeaturedTrueAndActiveTrueOrderBySortOrderAsc();
    }

    @GetMapping("/items/category/{categoryId}")
    public List<MenuItem> byCategory(@PathVariable Long categoryId) {
        return itemRepo.findByCategoryIdAndActiveTrueOrderBySortOrderAsc(categoryId);
    }

    @PostMapping("/items")
    public ResponseEntity<MenuItem> createItem(@RequestPart("item") MenuItem item,
                                               @RequestPart(value = "image", required = false) MultipartFile image) {
        if (image != null && !image.isEmpty()) item.setImageUrl(fileStorage.store(image));
        return ResponseEntity.ok(itemRepo.save(item));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<MenuItem> updateItem(@PathVariable Long id,
                                               @RequestPart("item") MenuItem updated,
                                               @RequestPart(value = "image", required = false) MultipartFile image) {
        return itemRepo.findById(id).map(i -> {
            i.setNameHu(updated.getNameHu());
            i.setNameEn(updated.getNameEn());
            i.setDescriptionHu(updated.getDescriptionHu());
            i.setDescriptionEn(updated.getDescriptionEn());
            i.setPriceHuf(updated.getPriceHuf());
            i.setPriceNote(updated.getPriceNote());
            i.setSortOrder(updated.getSortOrder());
            i.setFeatured(updated.getFeatured());
            i.setActive(updated.getActive());
            i.setCategory(updated.getCategory());
            if (image != null && !image.isEmpty()) {
                if (i.getImageUrl() != null) fileStorage.delete(i.getImageUrl());
                i.setImageUrl(fileStorage.store(image));
            }
            return ResponseEntity.ok(itemRepo.save(i));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemRepo.findById(id).ifPresent(i -> { i.setActive(false); itemRepo.save(i); });
        return ResponseEntity.ok().build();
    }
}
