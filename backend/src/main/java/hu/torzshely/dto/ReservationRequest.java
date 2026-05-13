package hu.torzshely.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ReservationRequest {
    @NotNull private Long slotId;
    @NotBlank private String guestName;
    @NotBlank private String phone;
    @Email private String email;
    @Min(1) @Max(20) @NotNull private Integer partySize;
    private String notes;
}
