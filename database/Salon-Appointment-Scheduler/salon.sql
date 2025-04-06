CREATE DATABASE salon;

-- Connect to the database (for psql CLI)
-- \c salon

-- Create services table
CREATE TABLE services (
                          service_id SERIAL PRIMARY KEY,
                          name VARCHAR(50) NOT NULL
);

-- Create customers table
CREATE TABLE customers (
                           customer_id SERIAL PRIMARY KEY,
                           phone VARCHAR(15) NOT NULL UNIQUE,
                           name VARCHAR(50) NOT NULL
);

-- Create appointments table
CREATE TABLE appointments (
                              appointment_id SERIAL PRIMARY KEY,
                              customer_id INT NOT NULL REFERENCES customers(customer_id),
                              service_id INT NOT NULL REFERENCES services(service_id),
                              time VARCHAR(10) NOT NULL
);

-- Insert initial services
INSERT INTO services (service_id, name) VALUES
                                            (1, 'cut'),
                                            (2, 'color'),
                                            (3, 'perm'),
                                            (4, 'style'),
                                            (5, 'trim');
