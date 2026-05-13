package hu.torzshely.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ContactFormDto {
    @NotBlank private String name;
    @Email @NotBlank private String email;
    private String phone;
    @NotBlank private String message;
}
