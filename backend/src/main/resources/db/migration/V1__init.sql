-- Events
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title_hu VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_hu TEXT,
    description_en TEXT,
    event_date TIMESTAMP NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100),
    price_huf INTEGER,
    registration_info TEXT,
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Menu Categories
CREATE TABLE menu_categories (
    id BIGSERIAL PRIMARY KEY,
    name_hu VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    type VARCHAR(50) DEFAULT 'food',
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE
);

-- Menu Items
CREATE TABLE menu_items (
    id BIGSERIAL PRIMARY KEY,
    category_id BIGINT REFERENCES menu_categories(id) ON DELETE CASCADE,
    name_hu VARCHAR(255) NOT NULL,
    name_en VARCHAR(255),
    description_hu TEXT,
    description_en TEXT,
    price_huf INTEGER,
    price_note VARCHAR(100),
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE
);

-- Gallery
CREATE TABLE gallery_photos (
    id BIGSERIAL PRIMARY KEY,
    image_url VARCHAR(500) NOT NULL,
    caption_hu VARCHAR(500),
    caption_en VARCHAR(500),
    category VARCHAR(100) DEFAULT 'general',
    sort_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Reviews
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    author_name VARCHAR(255) NOT NULL,
    text_hu TEXT NOT NULL,
    text_en TEXT,
    rating INTEGER DEFAULT 5,
    review_date DATE,
    source VARCHAR(100) DEFAULT 'manual',
    featured BOOLEAN DEFAULT TRUE,
    active BOOLEAN DEFAULT TRUE
);

-- Opening Hours
CREATE TABLE opening_hours (
    id BIGSERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL UNIQUE,
    open_time VARCHAR(10),
    close_time VARCHAR(10),
    closed BOOLEAN DEFAULT FALSE,
    note_hu VARCHAR(255),
    note_en VARCHAR(255)
);

-- Reservation Slots
CREATE TABLE reservation_slots (
    id BIGSERIAL PRIMARY KEY,
    slot_date DATE NOT NULL,
    slot_time TIME NOT NULL,
    capacity INTEGER NOT NULL,
    booked INTEGER DEFAULT 0
);

-- Reservations
CREATE TABLE reservations (
    id BIGSERIAL PRIMARY KEY,
    slot_id BIGINT REFERENCES reservation_slots(id),
    guest_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    party_size INTEGER NOT NULL,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- SEED DATA
-- ========================

-- Opening Hours (Mon-Sun)
INSERT INTO opening_hours (day_of_week, open_time, close_time, closed, note_hu, note_en) VALUES
(1, NULL, NULL, TRUE, 'Hétfőn zárva tartunk', 'Closed on Mondays'),
(2, '16:00', '23:00', FALSE, NULL, NULL),
(3, '16:00', '23:00', FALSE, NULL, NULL),
(4, '16:00', '23:00', FALSE, NULL, NULL),
(5, '16:00', '01:00', FALSE, NULL, NULL),
(6, '16:00', '01:00', FALSE, NULL, NULL),
(7, '14:00', '22:00', FALSE, NULL, NULL);

-- Reviews
INSERT INTO reviews (author_name, text_hu, text_en, rating, review_date, source, featured) VALUES
('Kovács Péter', 'Kedves kiszolgálás, hangulatos hely. Sokat fogunk még itt járni! A sörkínálat egyszerűen páratlan a kerületben.', 'Friendly service, cozy atmosphere. We will definitely be back! The beer selection is simply unmatched in the district.', 5, '2026-04-15', 'google', TRUE),
('Varga Eszter', 'Törzshely lett a mi törzshelyünk is! Remek kvízestek, jó sörök, barátságos személyzet. Mindenkinek ajánlom!', 'This place has become our regular spot! Great quiz nights, good beers, friendly staff. Highly recommended!', 5, '2026-03-22', 'facebook', TRUE),
('Tóth László', 'Nagyon jó hely, barátságos személyzet, finom italok, kellemes légkör. A Whisky Kóstoló egyszerűen fantasztikus volt!', 'Great place, friendly staff, delicious drinks, pleasant atmosphere. The Whisky Tasting was simply fantastic!', 5, '2026-04-02', 'google', TRUE),
('Szabó Kinga', 'A XVI. kerület legbarátságosabb sörözője! Heti rendszerességgel járunk kvízestre, mindig tele, mindig hangulatos.', 'The friendliest pub in District XVI! We go to quiz night weekly, always full, always atmospheric.', 5, '2026-02-18', 'facebook', TRUE),
('Molnár Gábor', 'Páratlan hangulat, igazi közösségi hely. A csapoltsör-kínálat kerületben egyedülálló. Örömmel ajánlom mindenkinek!', 'Unparalleled atmosphere, a real community place. The draft beer selection is unique in the district. Highly recommended!', 5, '2026-01-30', 'google', TRUE);

-- Menu Categories – Food
INSERT INTO menu_categories (name_hu, name_en, type, sort_order) VALUES
('Szendvicsek', 'Sandwiches', 'food', 1),
('Hamburgerek', 'Burgers', 'food', 2),
('Nassolnivalók', 'Snacks', 'food', 3);

-- Menu Categories – Drinks
INSERT INTO menu_categories (name_hu, name_en, type, sort_order) VALUES
('Csapolt sörök', 'Draft Beers', 'drink', 1),
('Üveges sörök', 'Bottled Beers', 'drink', 2),
('Whisky & Párlatok', 'Whisky & Spirits', 'drink', 3),
('Koktélok', 'Cocktails', 'drink', 4),
('Borok', 'Wines', 'drink', 5),
('Pálinkák', 'Pálinka', 'drink', 6),
('Long drinkek', 'Long Drinks', 'drink', 7),
('Alkoholmentes', 'Non-Alcoholic', 'drink', 8),
('Shotok', 'Shots', 'drink', 9);

-- Menu Items – Food (category_id 1=Szendvicsek, 2=Hamburgerek, 3=Nassolnivalók)
INSERT INTO menu_items (category_id, name_hu, name_en, description_hu, price_huf, sort_order, featured) VALUES
(1, 'Klasszikus melegszendvics', 'Classic Hot Sandwich', 'Sajt, sonka, paradicsomszósz, pirítva', 1200, 1, FALSE),
(1, 'Toast variációk', 'Toast Variations', 'Napi friss feltétekkel', 1100, 2, FALSE),
(2, 'Törzshely Burger', 'Törzshely Burger', 'Házilagos marhahús-pogácsa, cheddar, saláta, paradicsom, lilahagyma, házi szósz', 2800, 1, TRUE),
(2, 'Csípős Burger', 'Spicy Burger', 'Fűszeres csirkemell, jalapeño, chipotle szósz, coleslaw', 2600, 2, FALSE),
(3, 'Sajt- és felvágotttál', 'Cheese & Charcuterie Board', 'Válogatott sajtok, felvágottak, olajbogyó, kenyér', 3200, 1, TRUE),
(3, 'Nachos', 'Nachos', 'Tortilla chips, sajt szósz, salsa, tejföl', 1800, 2, FALSE),
(3, 'Sózott mogyoró', 'Salted Peanuts', 'Frissen pirított sózott mogyoró', 500, 3, FALSE);

-- Menu Items – Drinks (category_id 4=Draft, 5=Bottle, 6=Whisky, 7=Cocktails, 8=Wines, 9=Palinka, 10=Long, 11=Soft, 12=Shots)
INSERT INTO menu_items (category_id, name_hu, name_en, description_hu, price_huf, price_note, sort_order, featured) VALUES
(4, 'Bakalár Prémium', 'Bakalár Premium', 'Cseh lager, 4,9% – aranyszínű, krémes habkorona, Saaz komló', 900, '0,5l', 1, TRUE),
(4, 'Bernard Celebration', 'Bernard Celebration', 'Pasztőrizálatlan lager, 5% – kenyeres, enyhe karamellás jegyek', 950, '0,5l', 2, TRUE),
(5, 'Heineken', 'Heineken', NULL, 800, '0,33l', 1, FALSE),
(5, 'Dreher', 'Dreher', NULL, 700, '0,5l', 2, FALSE),
(5, 'Kozel', 'Kozel', NULL, 800, '0,5l', 3, FALSE),
(6, 'Tullamore D.E.W.', 'Tullamore D.E.W.', 'Ír whisky – lágy, gyümölcsös, vaníliás', 1500, '4cl', 1, TRUE),
(6, 'Monkey Shoulder', 'Monkey Shoulder', 'Blended scotch – karamell, méz, vanílja', 1700, '4cl', 2, TRUE),
(6, 'Tullamore D.E.W. Rum Cask', 'Tullamore D.E.W. Rum Cask', '12 éves, rumhordóban érlelve', 2200, '4cl', 3, FALSE),
(6, 'Glenfiddich 12', 'Glenfiddich 12', 'Single malt scotch – gyümölcsös, friss', 2500, '4cl', 4, FALSE),
(6, 'The Balvenie 12 Doublewood', 'The Balvenie 12 Doublewood', 'Kétféle hordóban érlelve – vanília, méz, szegfűszeg', 2800, '4cl', 5, FALSE),
(7, 'Aperol Spritz', 'Aperol Spritz', 'Aperol, Cinzano To Spritz, szóda', 2600, NULL, 1, TRUE),
(7, 'Bacardi Mojito', 'Bacardi Mojito', 'Bacardi, lime, menta, szóda', 2800, NULL, 2, FALSE),
(7, 'Espresso Martini', 'Espresso Martini', 'Vodka, kávélikőr, eszpresszó, cukorszirup', 3000, NULL, 3, FALSE),
(7, 'Negroni', 'Negroni', 'Gin, Rosso Martini, Campari', 2600, NULL, 4, FALSE),
(7, 'Long Island Iced Tea', 'Long Island Iced Tea', 'Vodka, tequila, Bacardi, gin, Cointreau, citromlé, cola', 3600, NULL, 5, FALSE),
(9, 'Vodka shot', 'Vodka shot', NULL, 600, NULL, 1, FALSE),
(9, 'Tequila shot', 'Tequila shot', NULL, 700, NULL, 2, FALSE),
(9, '6 Shot akció', '6 Shot deal', 'Vegyes: Vodka + Tequila', 2600, '6db', 3, TRUE);

-- Upcoming events (May 2026)
INSERT INTO events (title_hu, title_en, description_hu, description_en, event_date, category, price_huf, registration_info, featured, active) VALUES
('Zenei Kvíz', 'Music Quiz', 'Zenei tematikájú vetélkedő csapatoknak. Hozd a barátaidat, és mutasd meg, mennyi mindent tudsz a zenéről! Díjak a legjobb csapatoknak.', 'Music-themed quiz competition for teams. Bring your friends and show how much you know about music! Prizes for the best teams.', '2026-05-12 19:00:00', 'quiz', NULL, NULL, TRUE, TRUE),
('Karaoke Est', 'Karaoke Night', 'Csillagok vagyunk mind! Gyere és énekelj te is a Törzshely 16 mikrofonjába. Minden stílus, minden korosztály!', 'We are all stars! Come and sing into the Törzshely 16 microphone. All styles, all ages!', '2026-05-16 20:00:00', 'karaoke', NULL, NULL, FALSE, TRUE),
('Whisky Kóstoló', 'Whisky Tasting', '5 különböző whisky kóstolása finom sajt- és snack-válogatással. Kóstolt tételek: Monkey Shoulder, Tullamore D.E.W., Tullamore Rum Cask, Glenfiddich 12, The Balvenie 12 Doublewood. Előzetes jelentkezés szükséges!', 'Tasting of 5 different whiskies with fine cheese and snack selection. Items: Monkey Shoulder, Tullamore D.E.W., Tullamore Rum Cask, Glenfiddich 12, The Balvenie 12 Doublewood. Pre-registration required!', '2026-05-21 20:00:00', 'tasting', 15000, 'Telefonon, Messengeren vagy személyesen | By phone, Messenger, or in person: +36 30 383 9818', TRUE, TRUE),
('Foci Kvíz', 'Football Quiz', 'Foci-kvíz bajnokság a legjobb szurkolóknak! Bajnokok Ligája témában. Csapatok max. 5 fővel. Díjak a dobogósoknak!', 'Football quiz championship for the best fans! Champions League themed. Teams of max. 5. Prizes for the top three!', '2026-05-26 19:00:00', 'quiz', NULL, NULL, FALSE, TRUE);

-- Reservation slots (next 2 weeks, Tue-Sun, 18:00 and 20:00)
INSERT INTO reservation_slots (slot_date, slot_time, capacity, booked) VALUES
('2026-05-14', '18:00', 20, 0), ('2026-05-14', '20:00', 20, 0),
('2026-05-15', '18:00', 20, 0), ('2026-05-15', '20:00', 20, 0),
('2026-05-16', '18:00', 20, 0), ('2026-05-16', '20:00', 20, 0),
('2026-05-17', '16:00', 20, 0), ('2026-05-17', '18:00', 20, 0),
('2026-05-20', '18:00', 20, 0), ('2026-05-20', '20:00', 20, 0),
('2026-05-21', '18:00', 20, 0), ('2026-05-21', '20:00', 20, 0),
('2026-05-22', '18:00', 20, 0), ('2026-05-22', '20:00', 20, 0),
('2026-05-23', '18:00', 20, 0), ('2026-05-23', '20:00', 20, 0),
('2026-05-24', '16:00', 20, 0), ('2026-05-24', '18:00', 20, 0);
