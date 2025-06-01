create database CarRentalProject_Test

--drop database CarRentalProject_Test

	
use CarRentalProject_Test

-- ENUM-like tables for status values (simplified)
CREATE TABLE user_status (
    status_id tinyint PRIMARY KEY,
    status_name varchar(20) NOT NULL UNIQUE
);

CREATE TABLE car_status (
    status_id tinyint PRIMARY KEY,
    status_name varchar(20) NOT NULL UNIQUE
);

CREATE TABLE payment_status (
    status_id tinyint PRIMARY KEY,
    status_name varchar(20) NOT NULL UNIQUE
);

-- Core tables with basic constraints

CREATE TABLE login_users (
    user_id int PRIMARY KEY IDENTITY(1,1),
    username varchar(50) NOT NULL UNIQUE,
    password varchar(255) NOT NULL,
    email varchar(100) NOT NULL UNIQUE,
    role varchar(20) NOT NULL CHECK (role IN ('Admin', 'CarPartner', 'Driver', 'CompanyUser', 'User')),
    status_id tinyint NOT NULL FOREIGN KEY REFERENCES user_status(status_id)
);

--alter table login_users 
--alter column role varchar(20) not null
--CHECK (role in ('Admin', 'CarPartner', 'Driver', 'CompanyUser', 'User'));

ALTER TABLE login_users 
ADD CONSTRAINT chk_role_valid
CHECK (role IN ('Admin', 'CarPartner', 'Driver', 'CompanyUser', 'User'));

CREATE TABLE companies (
    company_id int PRIMARY KEY IDENTITY(1,1),
    company_name varchar(100) NOT NULL,
    contact_person varchar(100),
    phone_number varchar(15),
    address varchar(255),
    discount_percentage decimal(5,2) CHECK (discount_percentage BETWEEN 0 AND 100)
);


CREATE TABLE car_partners (
    car_partner_id int PRIMARY KEY IDENTITY(1,1),
    user_id int NOT NULL FOREIGN KEY REFERENCES login_users(user_id),
    company_name varchar(100) NOT NULL,
    contact_person varchar(100),
    phone_number varchar(15),
    address varchar(255),
    contribution_percentage decimal(5,2) CHECK (contribution_percentage BETWEEN 0 AND 100)
);

CREATE TABLE cars (
    car_id int PRIMARY KEY IDENTITY(1,1),
    car_partner_id int NOT NULL FOREIGN KEY REFERENCES car_partners(car_partner_id),
    category varchar(20) NOT NULL,
    model varchar(50) NOT NULL,
    year int CHECK (year IS NULL OR year BETWEEN 1900 AND YEAR(GETDATE())+5),
    license_plate varchar(20) NOT NULL UNIQUE,
    color varchar(20),
	no_seats tinyint,
    fuel_type varchar(20),
    features text,
    status_id tinyint NOT NULL FOREIGN KEY REFERENCES car_status(status_id),
    odometer_reading int NOT NULL DEFAULT 0,
    price_per_hour decimal(10,2) NOT NULL CHECK (price_per_hour > 0),
	image_path varchar(255), --DEFAULT -- LINE TO BE ADDED,
);

ALTER TABLE cars
ADD transmission VARCHAR(10) 
CHECK (transmission IN ('Manual', 'Automatic'))
DEFAULT 'Manual';
update cars
set transmission = 'Manual';
Alter table cars
add Brand varchar(20) not null default 'BMW';



--ALTER TABLE CARS	
--ADD no_seats tinyint;
--ALTER TABLE CARS
--ADD image_path varchar(255) NULL;

CREATE TABLE drivers (
    driver_id int PRIMARY KEY IDENTITY(1,1),
    user_id int NOT NULL FOREIGN KEY REFERENCES login_users(user_id),
    license_number varchar(50),
    phone_number varchar(15),
    address varchar(255),
    rating decimal(3,2) CHECK (rating IS NULL OR (rating BETWEEN 0 AND 5))
);

CREATE TABLE promotions (
    promotion_id int PRIMARY KEY IDENTITY(1,1),
    promotion_code varchar(50) NOT NULL UNIQUE,
    description text,
    discount_percentage decimal(5,2) NOT NULL CHECK (discount_percentage BETWEEN 0 AND 100),
    start_date date DEFAULT GETDATE(),
    end_date date,
    is_active bit DEFAULT 1,
    CHECK (end_date IS NULL OR end_date > start_date)
);

CREATE TABLE company_requests (
    request_id int PRIMARY KEY IDENTITY(1,1),
    company_id int NOT NULL FOREIGN KEY REFERENCES companies(company_id),
    package_name varchar(255),
    is_active bit DEFAULT 1,
    request_name varchar(50) NOT NULL
);

CREATE TABLE scheduling (
    schedule_id int PRIMARY KEY IDENTITY(1,1),
    client_id int NOT NULL FOREIGN KEY REFERENCES companies(company_id),
    car_id int NOT NULL FOREIGN KEY REFERENCES cars(car_id),
    driver_id int NOT NULL FOREIGN KEY REFERENCES drivers(driver_id),
    start_date datetime NOT NULL,
    end_date datetime NOT NULL,
    expected_cost decimal(10,2),
    location_from varchar(255),
    location_to varchar(255),
    remarks text,
    promotion_id int FOREIGN KEY REFERENCES promotions(promotion_id),
    amount_paid decimal(10,2) NOT NULL CHECK (amount_paid >= 0),
    CHECK (end_date > start_date),
	[status] varchar(20) NOT NULL check ([status] in ('Confirmed', 'Ongoing', 'Not Confirmed'))
);


--alter table scheduling 
--add [status] varchar(20) NOT NULL check ([status] in ('Confirmed', 'Ongoing', 'Not Confirmed'));

CREATE TABLE transactions (
    transaction_id int PRIMARY KEY IDENTITY(1,1),
	car_id int foreign key references cars(car_id),
    schedule_id int NOT NULL, -- FOREIGN KEY REFERENCES scheduling(schedule_id),
    initial_odometer int,
    final_odometer int,
    fuel_usage decimal(5,2),
    maintenance_required bit,
    maintenance_cost decimal(10,2) CHECK (maintenance_cost IS NULL OR maintenance_cost >= 0),
    total_cost decimal(10,2),
    transaction_time datetime DEFAULT CURRENT_TIMESTAMP,
    remarks text,
    payment_status_id tinyint -- FOREIGN KEY REFERENCES payment_status(status_id)
);
ALTER TABLE [transactions]
add constraint fk_Transac foreign key (schedule_id) references scheduling(schedule_id);
Alter TABLE [transactions]
add constraint fk_PStatus foreign key (payment_status_id) references payment_status(status_id);

CREATE TABLE payments (
    payment_id int PRIMARY KEY IDENTITY(1,1),
    transaction_id int NOT NULL FOREIGN KEY REFERENCES transactions(transaction_id),
    payment_amount decimal(10,2) NOT NULL CHECK (payment_amount > 0),
    payment_method varchar(50) NOT NULL,
    currency char(3) DEFAULT 'USD',
    status_id tinyint NOT NULL FOREIGN KEY REFERENCES payment_status(status_id),
    processed_at datetime DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_history (
    maintenance_id int PRIMARY KEY IDENTITY(1,1),
    car_id int NOT NULL FOREIGN KEY REFERENCES cars(car_id),
    maintenance_date datetime DEFAULT CURRENT_TIMESTAMP,
    description text,
    cost decimal(10,2) CHECK (cost IS NULL OR cost >= 0),
	odometer_reading int,
    service_center varchar(100),
);

CREATE TABLE request_details (
    request_detail_id int PRIMARY KEY IDENTITY(1,1),
    request_id int NOT NULL FOREIGN KEY REFERENCES company_requests(request_id),
    car_id int FOREIGN KEY REFERENCES cars(car_id),
    driver_id int FOREIGN KEY REFERENCES drivers(driver_id),
    start_time time,
    end_time time,
    location_from varchar(255),
    location_to varchar(255),
    remarks text,
    day_requested varchar(20),
    CHECK (end_time IS NULL OR start_time IS NULL OR end_time > start_time)
);



-- Insert basic status values
INSERT INTO user_status (status_id, status_name) VALUES 
(1, 'Activated'), (2, 'Deactivated'), (3, 'Suspended');

INSERT INTO car_status (status_id, status_name) VALUES 
(1, 'Available'), (2, 'Rented'), (3, 'Maintenance'), (4, 'Unavailable');

INSERT INTO payment_status (status_id, status_name) VALUES 
(1, 'Pending'), (2, 'Completed'), (3, 'Failed'), (4, 'Refunded');


SELECT * FROM payment_status
Order by [status_id] asc;
SELECT * FROM user_status
SELECT * FROM car_status




use CarRentalProject_Test
select * from cars
where license_plate = 'A321-ABCD'