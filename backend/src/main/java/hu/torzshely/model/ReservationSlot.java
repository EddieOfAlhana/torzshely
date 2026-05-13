package hu.torzshely.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "reservation_slots")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ReservationSlot {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate slotDate;

    @Column(nullable = false)
    private LocalTime slotTime;

    @Column(nullable = false)
    private Integer capacity;    // total seats available

    private Integer booked = 0;  // current bookings

    public int available() { return capacity - booked; }
}
