package hu.torzshely.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String authorName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String textHu;

    @Column(columnDefinition = "TEXT")
    private String textEn;

    private Integer rating = 5;
    private LocalDate reviewDate;
    private String source; // "google", "facebook", "manual"
    private Boolean featured = true;
    private Boolean active = true;
}
