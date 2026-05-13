ALTER TABLE menu_items ADD COLUMN abv VARCHAR(20);

UPDATE menu_items SET abv = '4,9%' WHERE name_hu = 'Bakalár Prémium';
UPDATE menu_items SET abv = '5,0%' WHERE name_hu = 'Bernard Celebration';
