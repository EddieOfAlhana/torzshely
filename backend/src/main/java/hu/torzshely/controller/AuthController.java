package hu.torzshely.controller;

import hu.torzshely.dto.LoginRequest;
import hu.torzshely.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final JwtTokenProvider tokenProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        if (!adminUsername.equals(req.getUsername()) || !adminPassword.equals(req.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("error", "Hibás felhasználónév vagy jelszó"));
        }
        String token = tokenProvider.generateToken(req.getUsername());
        return ResponseEntity.ok(Map.of("token", token, "username", adminUsername));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(org.springframework.security.core.Authentication auth) {
        return ResponseEntity.ok(Map.of("username", auth.getName()));
    }
}
