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
    private Integer capacity;       // total (indoorCapacity + outdoorCapacity)

    private Integer booked = 0;     // total booked (bookedIndoor + bookedOutdoor)

    @Column(nullable = false)
    private Integer indoorCapacity = 28;

    @Column(nullable = false)
    private Integer outdoorCapacity = 15;

    private Integer bookedIndoor = 0;
    private Integer bookedOutdoor = 0;

    public int available() { return capacity - booked; }
    public int availableIndoor() { return indoorCapacity - bookedIndoor; }
    public int availableOutdoor() { return outdoorCapacity - bookedOutdoor; }
}
