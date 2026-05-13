package hu.torzshely.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "gallery_photos")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GalleryPhoto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    private String captionHu;
    private String captionEn;
    private String category; // "interior", "terrace", "drinks", "food", "events"
    private Integer sortOrder = 0;
    private Boolean active = true;
    private Boolean featured = false;

    @Column(updatable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    void prePersist() { uploadedAt = LocalDateTime.now(); }
}
