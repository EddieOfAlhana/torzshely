package hu.torzshely.service;

import hu.torzshely.dto.ContactFormDto;
import hu.torzshely.model.Reservation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.to}")
    private String mailTo;

    @Value("${spring.mail.username}")
    private String mailFrom;

    public void sendContactForm(ContactFormDto dto) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(mailFrom);
            msg.setTo(mailTo);
            msg.setReplyTo(dto.getEmail());
            msg.setSubject("Törzshely 16 – Új üzenet a weboldalról: " + dto.getName());
            msg.setText("""
                    Feladó: %s
                    Email: %s
                    Telefon: %s

                    Üzenet:
                    %s
                    """.formatted(dto.getName(), dto.getEmail(),
                    dto.getPhone() != null ? dto.getPhone() : "–", dto.getMessage()));
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Failed to send contact email", e);
        }
    }

    public void sendReservationConfirmation(Reservation r) {
        if (r.getEmail() == null || r.getEmail().isBlank()) return;
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(mailFrom);
            msg.setTo(r.getEmail());
            msg.setSubject("Törzshely 16 – Foglalási visszaigazolás");
            msg.setText("""
                    Kedves %s!

                    Köszönjük foglalásodat! Hamarosan visszajelzünk.

                    Időpont: %s %s
                    Személyek száma: %s fő

                    Ha kérdésed van, hívj minket: +36 30 383 9818

                    Törzshely 16 csapata
                    """.formatted(
                    r.getGuestName(),
                    r.getSlot().getSlotDate(),
                    r.getSlot().getSlotTime(),
                    r.getPartySize()));
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Failed to send reservation confirmation", e);
        }
    }

    public void sendReservationNotification(Reservation r) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(mailFrom);
            msg.setTo(mailTo);
            msg.setSubject("Törzshely 16 – Új asztalfoglalás: " + r.getGuestName());
            msg.setText("""
                    Új foglalás érkezett!

                    Vendég: %s
                    Telefon: %s
                    Email: %s
                    Időpont: %s %s
                    Létszám: %s fő
                    Megjegyzés: %s

                    Jóváhagyás az admin felületen: /admin/reservations
                    """.formatted(
                    r.getGuestName(), r.getPhone(),
                    r.getEmail() != null ? r.getEmail() : "–",
                    r.getSlot().getSlotDate(), r.getSlot().getSlotTime(),
                    r.getPartySize(),
                    r.getNotes() != null ? r.getNotes() : "–"));
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Failed to send reservation notification", e);
        }
    }

    public void sendReservationStatusUpdate(Reservation r) {
        if (r.getEmail() == null || r.getEmail().isBlank()) return;
        try {
            String statusText = r.getStatus() == Reservation.Status.APPROVED
                    ? "jóváhagyva ✓" : "visszautasítva ✗";
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(mailFrom);
            msg.setTo(r.getEmail());
            msg.setSubject("Törzshely 16 – Foglalásod állapota: " + statusText);
            msg.setText("""
                    Kedves %s!

                    Foglalásod állapota megváltozott: %s
                    Időpont: %s %s | %s fő

                    %s

                    Törzshely 16 csapata | +36 30 383 9818
                    """.formatted(
                    r.getGuestName(), statusText,
                    r.getSlot().getSlotDate(), r.getSlot().getSlotTime(), r.getPartySize(),
                    r.getStatus() == Reservation.Status.APPROVED
                            ? "Várunk szeretettel!" : "Sajnáljuk! Hívj minket alternatív időpontért."));
            mailSender.send(msg);
        } catch (Exception e) {
            log.error("Failed to send status update email", e);
        }
    }
}
