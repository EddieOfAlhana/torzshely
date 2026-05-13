package hu.torzshely.repository;

import hu.torzshely.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByStatusOrderByCreatedAtDesc(Reservation.Status status);
    List<Reservation> findAllByOrderByCreatedAtDesc();
    List<Reservation> findBySlotId(Long slotId);
}
