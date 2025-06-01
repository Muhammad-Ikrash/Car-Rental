use CarRentalProject_Test



select * from car_status
select * from user_status
select * from payment_status

INSERT INTO login_users (username, password, email, role, status_id)
VALUES ('speedster_john', 'Password123', 'john@sportscars.com', 'CarPartner', 1);

INSERT INTO car_partners (user_id, company_name, contact_person, phone_number, address, contribution_percentage)
VALUES (1, 'Speedster Exotics', 'John Blaze', '1234567890', '123 Turbo Street, Fastville', 40.00);

-- Ferrari 488 GTB
INSERT INTO cars (
    car_partner_id, category, model, year, license_plate,
    color, no_seats, fuel_type, features, status_id,
    odometer_reading, price_per_hour, image_path
)
VALUES (
    1, 'Sports', 'Ferrari 488 GTB', 2021, 'F488-EX1',
    'Red', 2, 'Petrol', 'Twin-turbo V8, Launch Control, Carbon Ceramic Brakes', 1,
    5000, 250.00, '/images/ferrari_488.jpg'
);

-- Lamborghini Huracán
INSERT INTO cars (
    car_partner_id, category, model, year, license_plate,
    color, no_seats, fuel_type, features, status_id,
    odometer_reading, price_per_hour, image_path
)
VALUES (
    1, 'Sports', 'Lamborghini Huracán', 2022, 'LMB-HR1',
    'Yellow', 2, 'Petrol', 'V10, All-Wheel Drive, Sport Exhaust', 1,
    3200, 300.00, '/images/lamborghini_huracan.jpg'
);

-- Porsche 911 Turbo S
INSERT INTO cars (
    car_partner_id, category, model, year, license_plate,
    color, no_seats, fuel_type, features, status_id,
    odometer_reading, price_per_hour, image_path
)
VALUES (
    1, 'Sports', 'Porsche 911 Turbo S', 2020, '911TURBO-S',
    'Silver', 2, 'Petrol', 'Twin-turbo flat-six, Adaptive Spoiler, Launch Assist', 1,
    7800, 220.00, '/images/porsche_911.jpg'
);


-- Insert login for company user
INSERT INTO login_users (username, password, email, role, status_id)
VALUES ('alpha_corp', 'AlphaSecure1!', 'contact@alphacorp.com', 'CompanyUser', 1);

-- Assume user_id = 2
INSERT INTO companies (company_name, contact_person, phone_number, address, discount_percentage)
VALUES ('Alpha Corp', 'Alice Stone', '555-0123', '456 Business Blvd, Metropolis', 15.00);
-- Assume company_id = 1



INSERT INTO company_requests (company_id, package_name, is_active, request_name)
VALUES (1, 'Premium Package', 1, 'Monthly High-Speed Transport');
-- request_id = 1



-- Insert a Driver User
INSERT INTO login_users (username, password, email, role, status_id)
VALUES ('driver_mike', 'DriveFast@1', 'mike@drivers.com', 'Driver', 1);

-- Assume user_id = 3
INSERT INTO drivers (user_id, license_number, phone_number, address, rating)
VALUES (3, 'D12345678', '555-9090', '789 Wheels Ave, Fasttown', 4.8);
-- driver_id = 1

-- Insert into request_details
INSERT INTO request_details (
    request_id, car_id, driver_id,
    start_time, end_time,
    location_from, location_to,
    remarks, day_requested
)
VALUES (
    1, 1, 1, -- request_id, car_id (Ferrari), driver_id
    '08:00', '10:00',
    'Alpha HQ', 'Airport Terminal A',
    'VIP client transport',
    'Monday'
);


INSERT INTO scheduling (
    client_id, car_id, driver_id,
    start_date, end_date,
    expected_cost, location_from, location_to,
    remarks, promotion_id, amount_paid, status
)
VALUES (
    1, 1, 1,
    '2025-04-20 08:00', '2025-04-20 10:00',
    500.00, 'Alpha HQ', 'Airport Terminal A',
    'Scheduled VIP transport',
    NULL, -- no promotion
    500.00, 'Confirmed'
);
-- schedule_id = 1



EXEC sp_AddMaintenanceRecord
    @car_id = 1,
    @description = 'Engine oil change and brake pad replacement',
    @cost = 120.00,
    @odometer_reading = 5100,
    @service_center = 'Speed Garage';



	INSERT INTO transactions (
    car_id, schedule_id,
    initial_odometer, final_odometer,
    fuel_usage, maintenance_required, maintenance_cost,
    total_cost, remarks, payment_status_id
)
VALUES (
    1, 1,
    5000, 5100,
    8.5, 1, 120.00,
    620.00, 'Trip completed with maintenance',
    2 -- Completed
);
-- transaction_id = 1



INSERT INTO payments (
    transaction_id, payment_amount, payment_method,
    currency, status_id
)
VALUES (
    1, 620.00, 'Credit Card',
    'USD', 2
);



select * from maintenance_history