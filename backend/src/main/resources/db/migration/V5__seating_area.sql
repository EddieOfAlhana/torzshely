ALTER TABLE reservation_slots ADD COLUMN indoor_capacity INT NOT NULL DEFAULT 28;
ALTER TABLE reservation_slots ADD COLUMN outdoor_capacity INT NOT NULL DEFAULT 15;
ALTER TABLE reservation_slots ADD COLUMN booked_indoor INT NOT NULL DEFAULT 0;
ALTER TABLE reservation_slots ADD COLUMN booked_outdoor INT NOT NULL DEFAULT 0;

ALTER TABLE reservations ADD COLUMN seating_area VARCHAR(10);

-- Update total capacity to reflect the combined area seating
UPDATE reservation_slots SET capacity = 43;
