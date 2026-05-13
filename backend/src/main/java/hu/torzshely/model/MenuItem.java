package hu.torzshely.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "menu_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private MenuCategory category;

    @Column(nullable = false)
    private String nameHu;
    private String nameEn;

    @Column(columnDefinition = "TEXT")
    private String descriptionHu;
    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    private Integer priceHuf;
    private String priceNote;
    private String imageUrl;
    private Integer sortOrder = 0;
    private Boolean active = true;
    private Boolean featured = false;
}
