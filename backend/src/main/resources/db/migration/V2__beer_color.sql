-- Add color field to menu items for draught beer display
ALTER TABLE menu_items ADD COLUMN color VARCHAR(50);

-- Bernard is 4dl, not 0.5l
UPDATE menu_items SET price_note = '0,4l' WHERE name_hu = 'Bernard Celebration';

-- Set default colors for existing draught beers
UPDATE menu_items SET color = 'gold'   WHERE name_hu = 'Bakalár Prémium';
UPDATE menu_items SET color = 'copper' WHERE name_hu = 'Bernard Celebration';
