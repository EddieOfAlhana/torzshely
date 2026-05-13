package hu.torzshely.repository;

import hu.torzshely.model.OpeningHours;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface OpeningHoursRepository extends JpaRepository<OpeningHours, Long> {
    List<OpeningHours> findAllByOrderByDayOfWeekAsc();
    Optional<OpeningHours> findByDayOfWeek(Integer dayOfWeek);
}
