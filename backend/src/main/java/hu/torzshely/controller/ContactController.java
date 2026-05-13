package hu.torzshely.controller;

import hu.torzshely.dto.ContactFormDto;
import hu.torzshely.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<?> contact(@Valid @RequestBody ContactFormDto dto) {
        emailService.sendContactForm(dto);
        return ResponseEntity.ok(Map.of("message", "Üzeneted megérkezett! Hamarosan felvesszük veled a kapcsolatot."));
    }
}
