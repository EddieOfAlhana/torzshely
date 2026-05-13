package hu.torzshely.controller;

import hu.torzshely.dto.ReservationRequest;
import hu.torzshely.model.Reservation;
import hu.torzshely.model.ReservationSlot;
import hu.torzshely.repository.ReservationRepository;
import hu.torzshely.repository.ReservationSlotRepository;
import hu.torzshely.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationRepository reservationRepo;
    private final ReservationSlotRepository slotRepo;
    private final EmailService emailService;

    @GetMapping("/slots/{date}")
    public List<ReservationSlot> slotsForDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return slotRepo.findBySlotDateOrderBySlotTimeAsc(date);
    }

    @GetMapping("/slots/range")
    public List<ReservationSlot> slotsRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return slotRepo.findBySlotDateBetweenOrderBySlotDateAscSlotTimeAsc(from, to);
    }

    @PostMapping
    public ResponseEntity<?> book(@Valid @RequestBody ReservationRequest req) {
        ReservationSlot slot = slotRepo.findById(req.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        Reservation.SeatingArea area;
        try {
            area = Reservation.SeatingArea.valueOf(req.getSeatingArea());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Érvénytelen helyszín-választás."));
        }

        int available = area == Reservation.SeatingArea.INDOOR
                ? slot.availableIndoor()
                : slot.availableOutdoor();

        if (available < req.getPartySize()) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Nem áll rendelkezésre elegendő szabad hely erre az időpontra."));
        }

        if (area == Reservation.SeatingArea.INDOOR) {
            slot.setBookedIndoor(slot.getBookedIndoor() + req.getPartySize());
        } else {
            slot.setBookedOutdoor(slot.getBookedOutdoor() + req.getPartySize());
        }
        slot.setBooked(slot.getBooked() + req.getPartySize());
        slotRepo.save(slot);

        Reservation r = Reservation.builder()
                .slot(slot).guestName(req.getGuestName()).phone(req.getPhone())
                .email(req.getEmail()).partySize(req.getPartySize()).notes(req.getNotes())
                .seatingArea(area).status(Reservation.Status.PENDING).build();
        Reservation saved = reservationRepo.save(r);
        emailService.sendReservationConfirmation(saved);
        emailService.sendReservationNotification(saved);
        return ResponseEntity.ok(Map.of("id", saved.getId(), "message", "Foglalásod megérkezett! Hamarosan visszajelzünk."));
    }

    @GetMapping
    public List<Reservation> all() {
        return reservationRepo.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/pending")
    public List<Reservation> pending() {
        return reservationRepo.findByStatusOrderByCreatedAtDesc(Reservation.Status.PENDING);
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Reservation> updateStatus(@PathVariable Long id,
                                                     @RequestBody Map<String, String> body) {
        return reservationRepo.findById(id).map(r -> {
            Reservation.Status newStatus = Reservation.Status.valueOf(body.get("status"));
            if (newStatus == Reservation.Status.REJECTED && r.getStatus() == Reservation.Status.PENDING) {
                ReservationSlot slot = r.getSlot();
                if (r.getSeatingArea() == Reservation.SeatingArea.INDOOR) {
                    slot.setBookedIndoor(Math.max(0, slot.getBookedIndoor() - r.getPartySize()));
                } else if (r.getSeatingArea() == Reservation.SeatingArea.OUTDOOR) {
                    slot.setBookedOutdoor(Math.max(0, slot.getBookedOutdoor() - r.getPartySize()));
                }
                slot.setBooked(Math.max(0, slot.getBooked() - r.getPartySize()));
                slotRepo.save(slot);
            }
            r.setStatus(newStatus);
            Reservation saved = reservationRepo.save(r);
            emailService.sendReservationStatusUpdate(saved);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/slots")
    public ReservationSlot createSlot(@RequestBody ReservationSlot slot) {
        slot.setCapacity(slot.getIndoorCapacity() + slot.getOutdoorCapacity());
        return slotRepo.save(slot);
    }

    @DeleteMapping("/slots/{id}")
    public ResponseEntity<Void> deleteSlot(@PathVariable Long id) {
        slotRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
