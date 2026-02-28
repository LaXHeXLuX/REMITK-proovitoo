CREATE SCHEMA IF NOT EXISTS vehicle_booking;
SET search_path TO vehicle_booking;

CREATE TABLE vehicles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    number_of_seats INTEGER NOT NULL CHECK (number_of_seats > 0),
    fuel VARCHAR(20) NOT NULL,
    transmission VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL CHECK (year > 0)
);

CREATE TABLE units (
    id BIGSERIAL PRIMARY KEY,
    vehicle_id BIGINT REFERENCES vehicles ON DELETE RESTRICT NOT NULL,
    bookable BOOLEAN DEFAULT TRUE NOT NULL,
    licence_plate VARCHAR(20) UNIQUE,
    price_per_day NUMERIC(20, 2) CHECK (price_per_day >= 0),
    CONSTRAINT bookable_unit_has_price_and_plate CHECK (
        (bookable IS FALSE) OR (licence_plate IS NOT NULL AND price_per_day IS NOT NULL)
    )
);

CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE bookings (
    id BIGSERIAL PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    unit_id BIGINT REFERENCES units ON DELETE RESTRICT NOT NULL,
    booking_start TIMESTAMP NOT NULL,
    booking_end TIMESTAMP NOT NULL,
    CONSTRAINT booking_start_before_booking_end
        CHECK (booking_start < booking_end),
    CONSTRAINT no_overlapping_bookings EXCLUDE USING gist (
       unit_id WITH =,
       tsrange(booking_start, booking_end) WITH &&
    )
);

CREATE OR REPLACE FUNCTION check_unit_is_bookable()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT bookable FROM vehicle_booking.units WHERE id = NEW.unit_id) != TRUE
    THEN RAISE EXCEPTION 'Unit % is not bookable', NEW.unit_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_unit_bookable
BEFORE INSERT OR UPDATE ON bookings
FOR EACH ROW EXECUTE FUNCTION check_unit_is_bookable();