package hu.torzshely.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Event {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titleHu;

    private String titleEn;

    @Column(columnDefinition = "TEXT")
    private String descriptionHu;

    @Column(columnDefinition = "TEXT")
    private String descriptionEn;

    @Column(nullable = false)
    private LocalDateTime eventDate;

    private String imageUrl;
    private String category;
    private Integer priceHuf;
    private String registrationInfo;
    private Boolean featured = false;
    private Boolean active = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void prePersist() { createdAt = LocalDateTime.now(); }
}
