package hu.torzshely.repository;

import hu.torzshely.model.ReservationSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface ReservationSlotRepository extends JpaRepository<ReservationSlot, Long> {
    List<ReservationSlot> findBySlotDateOrderBySlotTimeAsc(LocalDate date);
    List<ReservationSlot> findBySlotDateBetweenOrderBySlotDateAscSlotTimeAsc(LocalDate from, LocalDate to);
}
