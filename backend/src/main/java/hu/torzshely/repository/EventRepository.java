package hu.torzshely.repository;

import hu.torzshely.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByActiveTrueAndEventDateAfterOrderByEventDateAsc(LocalDateTime from);
    List<Event> findByActiveTrueOrderByEventDateDesc();
}
