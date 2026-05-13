package hu.torzshely.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "opening_hours")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OpeningHours {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer dayOfWeek; // 1=Monday ... 7=Sunday

    private String openTime;   // "16:00" or null if closed
    private String closeTime;  // "23:00" or null if closed
    private Boolean closed = false;
    private String noteHu;
    private String noteEn;
}
