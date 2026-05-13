package hu.torzshely.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "menu_categories")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MenuCategory {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nameHu;
    private String nameEn;

    private String type; // "food" or "drink"
    private Integer sortOrder = 0;
    private Boolean active = true;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("sortOrder ASC")
    private List<MenuItem> items;
}
