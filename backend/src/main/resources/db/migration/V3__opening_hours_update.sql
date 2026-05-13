-- Updated opening hours: all days open
-- day_of_week: 1=Hétfő, 2=Kedd, 3=Szerda, 4=Csütörtök, 5=Péntek, 6=Szombat, 7=Vasárnap

UPDATE opening_hours SET open_time = '10:00', close_time = '24:00', closed = FALSE, note_hu = NULL, note_en = NULL WHERE day_of_week = 1;
UPDATE opening_hours SET open_time = '10:00', close_time = '24:00', closed = FALSE, note_hu = NULL, note_en = NULL WHERE day_of_week = 2;
UPDATE opening_hours SET open_time = '10:00', close_time = '24:00', closed = FALSE, note_hu = NULL, note_en = NULL WHERE day_of_week = 3;
UPDATE opening_hours SET open_time = '10:00', close_time = '24:00', closed = FALSE, note_hu = NULL, note_en = NULL WHERE day_of_week = 4;
UPDATE opening_hours SET open_time = '08:00', close_time = '24:00', closed = FALSE, note_hu = NULL, note_en = NULL WHERE day_of_week = 5;
UPDATE opening_hours SET open_time = '08:00', close_time = '24:00', closed = FALSE, note_hu = NULL, note_en = NULL WHERE day_of_week = 6;
UPDATE opening_hours SET open_time = '10:00', close_time = '24:00', closed = FALSE, note_hu = NULL, note_en = NULL WHERE day_of_week = 7;
