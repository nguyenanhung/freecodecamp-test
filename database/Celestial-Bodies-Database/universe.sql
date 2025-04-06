-- Create database
CREATE DATABASE universe;

-- Connect to the database (for psql CLI)
-- \c universe

-- Create galaxy table
CREATE TABLE galaxy (
    galaxy_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    distance_from_earth NUMERIC NOT NULL,
    has_life BOOLEAN NOT NULL DEFAULT FALSE,
    age_in_millions_of_years INT NOT NULL
);

-- Create star table
CREATE TABLE star (
    star_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    galaxy_id INT NOT NULL REFERENCES galaxy(galaxy_id),
    temperature INT NOT NULL,
    is_spherical BOOLEAN NOT NULL DEFAULT TRUE
);

-- Create planet table
CREATE TABLE planet (
    planet_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    star_id INT NOT NULL REFERENCES star(star_id),
    has_life BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT
);

-- Create moon table
CREATE TABLE moon (
    moon_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    planet_id INT NOT NULL REFERENCES planet(planet_id),
    is_spherical BOOLEAN NOT NULL DEFAULT TRUE,
    diameter INT NOT NULL
);

-- Create an extra table for variety (5th table)
CREATE TABLE constellation (
    constellation_id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL
);

-- Insert data into galaxy table (6 rows)
INSERT INTO galaxy (name, distance_from_earth, has_life, age_in_millions_of_years) VALUES
('Milky Way', 0, TRUE, 13000),
('Andromeda', 2537000, FALSE, 10000),
('Triangulum', 3000000, FALSE, 9000),
('Sombrero', 29000000, FALSE, 8000),
('Whirlpool', 23000000, FALSE, 7000),
('Pinwheel', 21000000, FALSE, 6000);

-- Insert data into star table (6 rows)
INSERT INTO star (name, galaxy_id, temperature, is_spherical) VALUES
('Sun', 1, 5500, TRUE),
('Betelgeuse', 1, 3500, FALSE),
('Sirius', 1, 9940, TRUE),
('Andromeda Alpha', 2, 6000, TRUE),
('Triangulum Prime', 3, 4500, TRUE),
('Sombrero Star', 4, 7000, TRUE);

-- Insert data into planet table (12 rows)
INSERT INTO planet (name, star_id, has_life, description) VALUES
('Earth', 1, TRUE, 'A blue planet with diverse life forms.'),
('Mars', 1, FALSE, 'The red planet with potential for colonization.'),
('Venus', 1, FALSE, 'A hot, volcanic world.'),
('Jupiter', 1, FALSE, 'A gas giant with many moons.'),
('Sirius B', 3, FALSE, 'A rocky exoplanet orbiting Sirius.'),
('Alpha Prime', 4, FALSE, 'A distant world in Andromeda.'),
('Triangulum I', 5, FALSE, 'A cold, icy planet.'),
('Sombrero X', 6, FALSE, 'A dusty planet with rings.'),
('Betelgeuse I', 2, FALSE, 'A massive, barren world.'),
('Saturn', 1, FALSE, 'Known for its stunning rings.'),
('Neptune', 1, FALSE, 'A windy, blue ice giant.'),
('Uranus', 1, FALSE, 'A tilted ice giant.');

-- Insert data into moon table (20 rows)
INSERT INTO moon (name, planet_id, is_spherical, diameter) VALUES
('Moon', 1, TRUE, 3474),
('Phobos', 2, FALSE, 22),
('Deimos', 2, FALSE, 12),
('Io', 4, TRUE, 3643),
('Europa', 4, TRUE, 3122),
('Ganymede', 4, TRUE, 5268),
('Callisto', 4, TRUE, 4821),
('Titan', 10, TRUE, 5150),
('Rhea', 10, TRUE, 1527),
('Iapetus', 10, TRUE, 1469),
('Triton', 11, TRUE, 2707),
('Nereid', 11, FALSE, 340),
('Titania', 12, TRUE, 1578),
('Oberon', 12, TRUE, 1523),
('Sirius Moon I', 5, TRUE, 1000),
('Alpha Moon A', 6, TRUE, 800),
('Triangulum Moon', 7, FALSE, 500),
('Sombrero Satellite', 8, TRUE, 1200),
('Betelgeuse Moon', 9, FALSE, 600),
('Mars Moon X', 2, TRUE, 15);

-- Insert data into constellation table (3 rows)
INSERT INTO constellation (name, description) VALUES
('Orion', 'A prominent hunter in the night sky.'),
('Ursa Major', 'The Great Bear, home to the Big Dipper.'),
('Cassiopeia', 'A W-shaped constellation near the North Star.');
