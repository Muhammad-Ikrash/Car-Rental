--
--
-- Authentication and User Management
--
--


CREATE PROCEDURE sp_RegisterUser
    @username VARCHAR(50),
    @password VARCHAR(255),
    @email VARCHAR(100),
    @role VARCHAR(20),
    @status_id TINYINT
AS
BEGIN
    SET NOCOUNT ON;

    -- Ensure role is valid
    IF @role NOT IN ('Admin', 'CarPartner', 'Driver', 'CompanyUser', 'User')
    BEGIN
        RAISERROR('Invalid role specified.', 16, 1);
        RETURN;
    END

    -- Insert new user
    BEGIN TRY
        INSERT INTO login_users (username, password, email, role, status_id)
        VALUES (@username, @password, @email, @role, @status_id);
    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END

go
CREATE PROCEDURE sp_LoginUser
    @username VARCHAR(50),
    @password VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT user_id, username, email, role, status_id
    FROM login_users
    WHERE username = @username AND password = @password;
END


go
CREATE PROCEDURE sp_UpdateUserStatus
    @user_id INT,
    @new_status_id TINYINT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM user_status WHERE status_id = @new_status_id)
    BEGIN
        RAISERROR('Invalid status ID.', 16, 1);
        RETURN;
    END

    UPDATE login_users
    SET status_id = @new_status_id
    WHERE user_id = @user_id;
END


go
CREATE PROCEDURE sp_GetAllUsers
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        u.user_id,
        u.username,
        u.email,
        u.role,
        us.status_name AS status
    FROM login_users u
    JOIN user_status us ON u.status_id = us.status_id
    ORDER BY u.user_id;
END


--
--
-- Car And Management Procedures 
--
--

GO
CREATE PROCEDURE sp_AddCarPartner
    @user_id INT,
    @company_name VARCHAR(100),
    @contact_person VARCHAR(100),
    @phone_number VARCHAR(15),
    @address VARCHAR(255),
    @contribution_percentage DECIMAL(5,2)
AS
BEGIN
    SET NOCOUNT ON;

    IF @contribution_percentage < 0 OR @contribution_percentage > 100
    BEGIN
        RAISERROR('Contribution percentage must be between 0 and 100.', 16, 1);
        RETURN;
    END

    INSERT INTO car_partners (user_id, company_name, contact_person, phone_number, address, contribution_percentage)
    VALUES (@user_id, @company_name, @contact_person, @phone_number, @address, @contribution_percentage);
END



GO
CREATE PROCEDURE sp_AddCar
    @car_partner_id INT,
    @category VARCHAR(20),
    @model VARCHAR(50),
	@brand varchar(20),
	@transmission varchar(10),
    @year INT,
    @license_plate VARCHAR(20),
    @color VARCHAR(20),
    @no_seats TINYINT,
    @fuel_type VARCHAR(20),
    @features TEXT,
    @status_id TINYINT,
    @odometer_reading INT = 0,
    @price_per_hour DECIMAL(10,2),
    @image_path VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if car year is valid
    IF @year IS NOT NULL AND (@year < 1900 OR @year > YEAR(GETDATE()) + 5)
    BEGIN
        RAISERROR('Invalid car year.', 16, 1);
        RETURN;
    END

    IF @price_per_hour <= 0
    BEGIN
        RAISERROR('Price per hour must be greater than 0.', 16, 1);
        RETURN;
    END
	IF @transmission not in ('Manual', 'Automatic')
	begin 
		RAISERROR('Invalid Transmission Type',16, 1);
		return;
	end
    INSERT INTO cars (
        car_partner_id, category, model, year, license_plate,
        color, no_seats, fuel_type, features, status_id,
        odometer_reading, price_per_hour, image_path, transmission, brand
    )
    VALUES (
        @car_partner_id, @category, @model, @year, @license_plate,
        @color, @no_seats, @fuel_type, @features, @status_id,
        @odometer_reading, @price_per_hour, @image_path, @transmission, @brand
    );
END

select * from cars

EXEC sp_AddCar
	@car_partner_id = 1,
    @category = 'SUV',
    @model = 'Mini Cooper',
	@brand = 'BMW',
	@transmission ='Automatic',
    @year = 2020,
    @license_plate = 'LEM 2515',
    @color = 'White',
    @no_seats = 5,
    @fuel_type = 'Diesel',
    @features = 'V10, All-Wheel Drive, Sport Exhaust',
    @status_id = 1,
    @odometer_reading = 5678,
    @price_per_hour = 150,
    @image_path = 'src/img/cooper.png';

	select * from cars

GO
CREATE PROCEDURE sp_UpdateCarStatus
    @car_id INT,
    @status_id TINYINT
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM car_status WHERE status_id = @status_id)
    BEGIN
        RAISERROR('Invalid status ID.', 16, 1);
        RETURN;
    END

    UPDATE cars
    SET status_id = @status_id
    WHERE car_id = @car_id;
END


GO
CREATE PROCEDURE sp_UpdateCarInfo
    @car_id INT,
    @model VARCHAR(50),
    @category VARCHAR(20),
    @color VARCHAR(20),
    @fuel_type VARCHAR(20),
    @no_seats TINYINT,
    @features TEXT,
    @price_per_hour DECIMAL(10,2),
    @image_path VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE cars
    SET 
        model = @model,
        category = @category,
        color = @color,
        fuel_type = @fuel_type,
        no_seats = @no_seats,
        features = @features,
        price_per_hour = @price_per_hour,
        image_path = @image_path
    WHERE car_id = @car_id;
END


GO
CREATE PROCEDURE sp_GetCarsByPartner
    @car_partner_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        c.car_id,
        c.model,
        c.category,
        c.year,
        c.license_plate,
        c.status_id,
        cs.status_name AS status,
        c.price_per_hour
    FROM cars c
    JOIN car_status cs ON c.status_id = cs.status_id
    WHERE c.car_partner_id = @car_partner_id;
END


GO
CREATE PROCEDURE sp_GetCarDetails
    @car_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        c.*, 
        cp.company_name AS partner_company,
        cs.status_name AS car_status
    FROM cars c
    JOIN car_partners cp ON c.car_partner_id = cp.car_partner_id
    JOIN car_status cs ON c.status_id = cs.status_id
    WHERE c.car_id = @car_id;
END


--
--
-- Scheduling and Booking
--
--


GO
CREATE PROCEDURE sp_AddSchedule
    @client_id INT,
    @car_id INT,
    @driver_id INT,
    @start_date DATETIME,
    @end_date DATETIME,
    @expected_cost DECIMAL(10,2),
    @location_from VARCHAR(255),
    @location_to VARCHAR(255),
    @remarks TEXT,
    @promotion_id INT = NULL,
    @amount_paid DECIMAL(10,2),
    @status VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    IF @status NOT IN ('Confirmed', 'Ongoing', 'Not Confirmed')
    BEGIN
        RAISERROR('Invalid booking status.', 16, 1);
        RETURN;
    END

    IF @end_date <= @start_date
    BEGIN
        RAISERROR('End date must be greater than start date.', 16, 1);
        RETURN;
    END

    INSERT INTO scheduling (
        client_id, car_id, driver_id, start_date, end_date,
        expected_cost, location_from, location_to, remarks,
        promotion_id, amount_paid, [status]
    )
    VALUES (
        @client_id, @car_id, @driver_id, @start_date, @end_date,
        @expected_cost, @location_from, @location_to, @remarks,
        @promotion_id, @amount_paid, @status
    );
END


GO
CREATE PROCEDURE sp_UpdateBookingStatus
    @schedule_id INT,
    @new_status VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    IF @new_status NOT IN ('Confirmed', 'Ongoing', 'Not Confirmed')
    BEGIN
        RAISERROR('Invalid status value.', 16, 1);
        RETURN;
    END

    UPDATE scheduling
    SET [status] = @new_status
    WHERE schedule_id = @schedule_id;
END


GO
CREATE PROCEDURE sp_GetBookingsByCompany
    @company_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        s.schedule_id,
        s.start_date,
        s.end_date,
        s.location_from,
        s.location_to,
        s.amount_paid,
        s.expected_cost,
        s.status,
        c.model AS car_model,
        d.license_number AS driver_license
    FROM scheduling s
    JOIN cars c ON s.car_id = c.car_id
    JOIN drivers d ON s.driver_id = d.driver_id
    WHERE s.client_id = @company_id
    ORDER BY s.start_date DESC;
END



GO
CREATE PROCEDURE sp_GetAvailableCarsAndDrivers
AS
BEGIN
    SET NOCOUNT ON;

    SELECT car_id, model, license_plate
    FROM cars
    WHERE status_id = 1; -- 1 = Available

    SELECT driver_id, license_number, rating
    FROM drivers;
END


GO 
CREATE PROCEDURE sp_CancelBooking
    @schedule_id INT
AS
BEGIN

    UPDATE scheduling
    SET [status] = 'Not Confirmed'
    WHERE schedule_id = @schedule_id;
	
END


GO
CREATE PROCEDURE sp_GetBookingDetails
    @schedule_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        s.*, 
        c.model AS car_model,
        c.license_plate,
        d.license_number AS driver_license,
        d.rating,
        p.promotion_code,
        comp.company_name
    FROM scheduling s
    JOIN cars c ON s.car_id = c.car_id
    JOIN drivers d ON s.driver_id = d.driver_id
    LEFT JOIN promotions p ON s.promotion_id = p.promotion_id
    JOIN companies comp ON s.client_id = comp.company_id
    WHERE s.schedule_id = @schedule_id;
END


-- 
--
-- Managing Tranactions and Payments 
--
--

--drop procedure sp_addtransaction


GO
CREATE PROCEDURE sp_AddTransaction
    @car_id INT,
    @schedule_id INT,
    @initial_odometer INT,
    @final_odometer INT,
    @fuel_usage DECIMAL(5,2),
    @maintenance_required BIT,
    @maintenance_cost DECIMAL(10,2) = NULL,
    @total_cost DECIMAL(10,2),
    @remarks TEXT,
    @payment_status_id TINYINT
AS
BEGIN
    SET NOCOUNT ON;

	update scheduling
	set [status] = 'Confirmed' where schedule_id = @schedule_id

	update cars
	set [status_id] = 1 where car_id = @car_id

    IF @final_odometer < @initial_odometer
    BEGIN
        RAISERROR('Final odometer reading cannot be less than initial.', 16, 1);
        RETURN;
    END

    INSERT INTO transactions (
        car_id, schedule_id, initial_odometer, final_odometer, fuel_usage,
        maintenance_required, maintenance_cost, total_cost,
        remarks, payment_status_id
    )
    VALUES (
        @car_id, @schedule_id, @initial_odometer, @final_odometer, @fuel_usage,
        @maintenance_required, @maintenance_cost, @total_cost,
        @remarks, @payment_status_id
    );
END

--drop procedure sp_recordpayment
GO
CREATE PROCEDURE sp_RecordPayment
    @transaction_id INT,
    @payment_amount DECIMAL(10,2),
    @payment_method VARCHAR(50),
    @currency CHAR(3) = 'USD',
    @status_id TINYINT
AS
BEGIN
    SET NOCOUNT ON;

    IF @payment_amount <= 0
    BEGIN
        RAISERROR('Payment amount must be greater than zero.', 16, 1);
        RETURN;
    END

    INSERT INTO payments (
        transaction_id, payment_amount, payment_method,
        currency, status_id
    )
    VALUES (
        @transaction_id, @payment_amount, @payment_method,
        @currency, @status_id
    );
	update transactions
	set payment_status_id = 2;
END


GO
CREATE PROCEDURE sp_GetPaymentsByTransaction
    @transaction_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        p.payment_id,
        p.payment_amount,
        p.payment_method,
        p.currency,
        ps.status_name,
        p.processed_at
    FROM payments p
    JOIN payment_status ps ON p.status_id = ps.status_id
    WHERE p.transaction_id = @transaction_id;
END



GO
CREATE PROCEDURE sp_GetTransactionDetails
    @transaction_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        t.transaction_id,
        t.schedule_id,
        s.start_date,
        s.end_date,
        c.model,
        c.license_plate,
        t.initial_odometer,
        t.final_odometer,
        t.fuel_usage,
        t.maintenance_required,
        t.maintenance_cost,
        t.total_cost,
        t.transaction_time,
        t.remarks,
        ps.status_name AS payment_status
    FROM transactions t
    JOIN scheduling s ON t.schedule_id = s.schedule_id
    JOIN cars c ON t.car_id = c.car_id
    JOIN payment_status ps ON t.payment_status_id = ps.status_id
    WHERE t.transaction_id = @transaction_id;
END


GO
CREATE PROCEDURE sp_GetOutstandingTransactionsByCompany
    @company_id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        t.transaction_id,
        c.model,
        s.start_date,
        s.end_date,
        t.total_cost,
        ps.status_name AS payment_status
    FROM transactions t
    JOIN scheduling s ON t.schedule_id = s.schedule_id
    JOIN cars c ON t.car_id = c.car_id
    JOIN payment_status ps ON t.payment_status_id = ps.status_id
    WHERE s.client_id = @company_id AND t.payment_status_id = 1; -- Pending
END


--
--
-- extras 
--
--



GO
CREATE PROCEDURE sp_SubmitCompanyRequest
    @company_id INT,
    @package_name VARCHAR(255),
    @request_name VARCHAR(50)
AS
BEGIN
    INSERT INTO company_requests (company_id, package_name, request_name)
    VALUES (@company_id, @package_name, @request_name);
END


go
CREATE PROCEDURE sp_CreatePromotion
    @promotion_code VARCHAR(50),
    @description TEXT,
    @discount_percentage DECIMAL(5,2),
    @start_date DATE = NULL,
    @end_date DATE = NULL
AS
BEGIN
    INSERT INTO promotions (
        promotion_code, description, discount_percentage,
        start_date, end_date
    )
    VALUES (
        @promotion_code, @description, @discount_percentage,
        ISNULL(@start_date, GETDATE()), @end_date
    );
END

select * from login_users



go
CREATE PROCEDURE sp_ReportEarningsByMonth
AS
BEGIN
    SELECT 
        FORMAT(transaction_time, 'yyyy-MM') AS [Month],
        SUM(total_cost) AS TotalEarnings
    FROM transactions
    GROUP BY FORMAT(transaction_time, 'yyyy-MM')
    ORDER BY [Month] DESC;
END

drop procedure sp_reportactiverentals

go
CREATE PROCEDURE sp_ReportActiveRentals
AS
BEGIN
    SELECT 
        s.schedule_id,
        c.model,
        cp.company_name AS partner,
        d.user_id AS driver_id,
        s.start_date,
        s.end_date,
        s.location_from,
        s.location_to,
        s.status
    FROM scheduling s
    JOIN cars c ON s.car_id = c.car_id
    JOIN car_partners cp ON c.car_partner_id = cp.car_partner_id
    JOIN drivers d ON s.driver_id = d.driver_id
END




GO
CREATE PROCEDURE sp_AddMaintenanceRecord
    @car_id INT,
    @description TEXT,
    @cost DECIMAL(10,2) = NULL,
    @odometer_reading INT = NULL,
    @service_center VARCHAR(100) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- 1. Insert into maintenance_history
    INSERT INTO maintenance_history (
        car_id, description, cost, odometer_reading, service_center
    )
    VALUES (
        @car_id, @description, @cost, @odometer_reading, @service_center
    );

    -- 2. Update car status to 'Maintenance'
    UPDATE cars
    SET status_id = (SELECT status_id FROM car_status WHERE status_name = 'Maintenance')
    WHERE car_id = @car_id;
END


--
--
-- data deletion
--
--


go
CREATE PROCEDURE sp_DeleteUser
    @user_id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Delete associated driver or partner info
    DELETE FROM drivers WHERE user_id = @user_id;
    DELETE FROM car_partners WHERE user_id = @user_id;

    -- Finally delete the user
    DELETE FROM login_users WHERE user_id = @user_id;
END;




go
CREATE PROCEDURE sp_DeleteCompany
    @company_id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Delete related company requests and request details
    DELETE FROM request_details
    WHERE request_id IN (SELECT request_id FROM company_requests WHERE company_id = @company_id);

    DELETE FROM company_requests WHERE company_id = @company_id;

    -- Delete related schedules
    DELETE FROM scheduling WHERE client_id = @company_id;

    -- Finally delete the company
    DELETE FROM companies WHERE company_id = @company_id;
END;




go
CREATE PROCEDURE sp_DeleteCar
    @car_id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Delete maintenance records
    DELETE FROM maintenance_history WHERE car_id = @car_id;

    -- Delete transactions and payments related to car
    DELETE FROM payments WHERE transaction_id IN (
        SELECT transaction_id FROM transactions WHERE car_id = @car_id
    );

    DELETE FROM transactions WHERE car_id = @car_id;

    -- Delete from request_details & scheduling
    DELETE FROM request_details WHERE car_id = @car_id;
    DELETE FROM scheduling WHERE car_id = @car_id;

    -- Finally delete car
    DELETE FROM cars WHERE car_id = @car_id;
END;





go
CREATE PROCEDURE sp_DeleteSchedule
    @schedule_id INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Delete related payments and transaction
    DELETE FROM payments WHERE transaction_id IN (
        SELECT transaction_id FROM transactions WHERE schedule_id = @schedule_id
    );

    DELETE FROM transactions WHERE schedule_id = @schedule_id;

    -- Delete the schedule
    DELETE FROM scheduling WHERE schedule_id = @schedule_id;
END;




go
CREATE PROCEDURE sp_DeleteCompanyRequest
    @request_id INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM request_details WHERE request_id = @request_id;
    DELETE FROM company_requests WHERE request_id = @request_id;
END;
	





----
---- added later
----



go
create procedure sp_returnCarID
as
begin 
	select car_id from cars
end


exec sp_returncarID												  


go

CREATE PROCEDURE sp_FilterCars
    @Brand NVARCHAR(50) = NULL,
    @Model NVARCHAR(50) = NULL,
    @Year INT = NULL,
    @Type NVARCHAR(50) = NULL,
    @Transmission NVARCHAR(20) = NULL,
    @NoOfSeats INT = NULL,
    @MinPrice DECIMAL(10,2) = NULL,
    @MaxPrice DECIMAL(10,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM cars
    WHERE 
        (@Brand IS NULL OR brand = @Brand)
        AND (@Model IS NULL OR model = @Model)
        AND (@Year IS NULL OR year= @Year)
        AND (@Type IS NULL OR category = @Type)
        AND (@Transmission IS NULL OR transmission = @Transmission)
        AND (@NoOfSeats IS NULL OR no_seats = @NoOfSeats)
        AND (@MinPrice IS NULL OR price_per_hour >= @MinPrice)
        AND (@MaxPrice IS NULL OR price_per_hour <= @MaxPrice);
END;

select * from cars



-- Get all automatic SUVs made after 2018 with at least 5 seats and a max price of 100

select * from cars

go
CREATE PROCEDURE sp_RentCar
    @UserID INT,
    @CarID INT,
    @DriverID INT = NULL,
    @StartDate DATETIME = NULL,
    @EndDate DATETIME = NULL,
    @ExpectedCost DECIMAL(10,2) = NULL,
    @LocationFrom VARCHAR(255) = NULL,
    @LocationTo VARCHAR(255) = NULL,
    @Remarks TEXT = NULL,
    @PromotionID INT = NULL,
    @AmountPaid DECIMAL(10,2) = 0.0
AS
BEGIN
    SET NOCOUNT ON;
	
	DECLARE @CarStatusID TINYINT;

    SELECT @CarStatusID = status_id FROM Cars WHERE car_id = @CarID;

    IF @CarStatusID <> 1
    BEGIN
        RAISERROR('Car is not available for rent.', 16, 1);
        RETURN;
    END

    INSERT INTO Scheduling (
        client_id,
        car_id,
        driver_id,
        start_date,
        end_date,
        expected_cost,
        location_from,
        location_to,
        remarks,
        promotion_id,
        amount_paid,
        status
    )
    VALUES (
        @UserID,
        @CarID,
        @DriverID,
        ISNULL(@StartDate, GETDATE()),
        ISNULL(@EndDate, DATEADD(HOUR, 1, GETDATE())), -- Default: 1 hour trip
        ISNULL(@ExpectedCost, 0.0),
        ISNULL(@LocationFrom, 'Not Specified'),
        ISNULL(@LocationTo, 'Not Specified'),
        @Remarks,
        @PromotionID,
        @AmountPaid,
        'Confirmed' -- or use a status_id if normalized
    );

    -- Mark the car as 'Not Available' (you can use enum table or fixed value)
    UPDATE cars
    SET status_id = 4 -- Assuming 4 = Not Available
    WHERE car_id = @CarID;
END


go
CREATE PROCEDURE sp_GetDashboardStats
AS
BEGIN
    SET NOCOUNT ON;

    -- Total Cars by Status
    SELECT 
        cs.status_name,
        COUNT(c.car_id) AS TotalCars
    FROM Cars c
    JOIN Car_Status cs ON c.status_id = cs.status_id
    GROUP BY cs.status_name;

    -- Total Trips by Status
    SELECT 
        s.status,
        COUNT(s.schedule_id) AS TotalTrips
    FROM Scheduling s
    GROUP BY s.status;

    -- Total Payments (Aggregated)
    SELECT 
        COUNT(payment_id) AS TotalPayments,
        SUM(payment_amount) AS TotalRevenue,
        SUM(CASE WHEN status_id= 1 THEN payment_amount ELSE 0 END) AS CompletedRevenue
    FROM Payments;

    -- Total Maintenance Records
    SELECT 
        COUNT(maintenance_id) AS TotalMaintenanceLogs,
        SUM(cost) AS TotalMaintenanceCost
    FROM Maintenance_history;

    -- Company Requests Summary
    SELECT 
        COUNT(request_id) AS TotalCompanyRequests,
        COUNT(DISTINCT company_id) AS CompaniesRequested
    FROM company_requests;
END


exec sp_GetDashboardStats










EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'X1', @brand = 'BMW', @transmission = 'Automatic', @year = 2016, @license_plate = 'BM-6656', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.0L Turbocharged I4 (250 hp, 273 lb-ft), AWD, 8-Speed Auto, Leather Seats, Panoramic Sunroof, Wireless Apple CarPlay/Android Auto, Blind-Spot Monitor', @status_id = 1, @odometer_reading = 5989, @price_per_hour = 120, @image_path = 'src/img/x1.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'X2', @brand = 'BMW', @transmission = 'Automatic', @year = 2019, @license_plate = 'BM-6995', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.5L V6 (310 hp, 280 lb-ft), RWD, 10-Speed Auto, Heated/Cooled Front Seats, 12-Speaker Bose Audio, Heads-Up Display, Adaptive Cruise Control', @status_id = 1, @odometer_reading = 15792, @price_per_hour = 141, @image_path = 'src/img/x2.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'X3', @brand = 'BMW', @transmission = 'Automatic', @year = 2016, @license_plate = 'BM-2239', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Dual-Motor AWD (402 hp, 479 lb-ft), Single-Speed Auto, Vegan Leather, 15" Touchscreen Nav, Regenerative Braking, Lane-Keep Assist', @status_id = 1, @odometer_reading = 28854, @price_per_hour = 124, @image_path = 'src/img/x3.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'X4', @brand = 'BMW', @transmission = 'Automatic', @year = 2019, @license_plate = 'BM-7966', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '4.0L V8 (621 hp, 443 lb-ft), RWD, 7-Speed DCT, Carbon-Ceramic Brakes, Sports Exhaust, Carbon-Fiber Trim, Launch Control', @status_id = 1, @odometer_reading = 26487, @price_per_hour = 86, @image_path = 'src/img/x4.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'X5', @brand = 'BMW', @transmission = 'Automatic', @year = 2021, @license_plate = 'BM-9170', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '1.6L I4 Hybrid (140 hp total), FWD, CVT, Fabric Sport Seats, Keyless Entry & Start, Rear-view Camera, Forward Collision Warning', @status_id = 1, @odometer_reading = 16591, @price_per_hour = 117, @image_path = 'src/img/x5.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'X6', @brand = 'BMW', @transmission = 'Automatic', @year = 2016, @license_plate = 'BM-6263', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '5.2L V10 (602 hp, 413 lb-ft), AWD, 7-Speed Auto, Magnetic Ride Control, Diamond-Stitched Leather, Ceramic Coated Brake Calipers, LED Matrix Headlights', @status_id = 1, @odometer_reading = 16109, @price_per_hour = 98, @image_path = 'src/img/x6.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'X7', @brand = 'BMW', @transmission = 'Automatic', @year = 2019, @license_plate = 'BM-4653', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.5L Boxer-4 (228 hp, 184 lb-ft), AWD, CVT, X-Mode Off-road, EyeSight Driver Assist, Heated Steering Wheel, Roof Rails', @status_id = 1, @odometer_reading = 14727, @price_per_hour = 160, @image_path = 'src/img/x7.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = '2 Series', @brand = 'BMW', @transmission = 'Automatic', @year = 2017, @license_plate = 'BM-7265', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.3L EcoBoost I4 (310 hp, 350 lb-ft), 4x4, 10-Speed Auto, Trail Control, Digital Cluster, SYNC 4 Infotainment, 360° Camera', @status_id = 1, @odometer_reading = 3080, @price_per_hour = 94, @image_path = 'src/img/2_series.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = '3 Series', @brand = 'BMW', @transmission = 'Automatic', @year = 2021, @license_plate = 'BM-3188', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.0L Biturbo V6 (429 hp, 384 lb-ft), RWD, 9-Speed Auto, Air Suspension, Burmester 3D Sound, Night Vision Assist, Active Lane Keeping', @status_id = 1, @odometer_reading = 8413, @price_per_hour = 111, @image_path = 'src/img/3_series.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = '4 Series', @brand = 'BMW', @transmission = 'Automatic', @year = 2022, @license_plate = 'BM-8275', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Single-Motor RWD (201 hp, 236 lb-ft), Single-Speed, Heated Cloth Seats, 10.1" Touchscreen, Wireless Charging, Traffic Jam Assist', @status_id = 1, @odometer_reading = 2403, @price_per_hour = 163, @image_path = 'src/img/4_series.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Corolla', @brand = 'Toyota', @transmission = 'Automatic', @year = 2017, @license_plate = 'TO-9533', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.0L Turbocharged I4 (250 hp, 273 lb-ft), AWD, 8-Speed Auto, Leather Seats, Panoramic Sunroof, Wireless Apple CarPlay/Android Auto, Blind-Spot Monitor', @status_id = 1, @odometer_reading = 4517, @price_per_hour = 173, @image_path = 'src/img/corolla.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Camry', @brand = 'Toyota', @transmission = 'Automatic', @year = 2020, @license_plate = 'TO-3584', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.5L V6 (310 hp, 280 lb-ft), RWD, 10-Speed Auto, Heated/Cooled Front Seats, 12-Speaker Bose Audio, Heads-Up Display, Adaptive Cruise Control', @status_id = 1, @odometer_reading = 11811, @price_per_hour = 166, @image_path = 'src/img/camry.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'RAV4', @brand = 'Toyota', @transmission = 'Automatic', @year = 2022, @license_plate = 'TO-6217', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Dual-Motor AWD (402 hp, 479 lb-ft), Single-Speed Auto, Vegan Leather, 15" Touchscreen Nav, Regenerative Braking, Lane-Keep Assist', @status_id = 1, @odometer_reading = 11247, @price_per_hour = 185, @image_path = 'src/img/rav4.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Highlander', @brand = 'Toyota', @transmission = 'Automatic', @year = 2020, @license_plate = 'TO-2726', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '4.0L V8 (621 hp, 443 lb-ft), RWD, 7-Speed DCT, Carbon-Ceramic Brakes, Sports Exhaust, Carbon-Fiber Trim, Launch Control', @status_id = 1, @odometer_reading = 10123, @price_per_hour = 161, @image_path = 'src/img/highlander.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Tacoma', @brand = 'Toyota', @transmission = 'Automatic', @year = 2018, @license_plate = 'TO-8025', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '1.6L I4 Hybrid (140 hp total), FWD, CVT, Fabric Sport Seats, Keyless Entry & Start, Rear-view Camera, Forward Collision Warning', @status_id = 1, @odometer_reading = 28888, @price_per_hour = 183, @image_path = 'src/img/tacoma.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Tundra', @brand = 'Toyota', @transmission = 'Automatic', @year = 2019, @license_plate = 'TO-9429', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '5.2L V10 (602 hp, 413 lb-ft), AWD, 7-Speed Auto, Magnetic Ride Control, Diamond-Stitched Leather, Ceramic Coated Brake Calipers, LED Matrix Headlights', @status_id = 1, @odometer_reading = 1253, @price_per_hour = 157, @image_path = 'src/img/tundra.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Prius', @brand = 'Toyota', @transmission = 'Automatic', @year = 2020, @license_plate = 'TO-1442', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.5L Boxer-4 (228 hp, 184 lb-ft), AWD, CVT, X-Mode Off-road, EyeSight Driver Assist, Heated Steering Wheel, Roof Rails', @status_id = 1, @odometer_reading = 12659, @price_per_hour = 196, @image_path = 'src/img/prius.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Avalon', @brand = 'Toyota', @transmission = 'Automatic', @year = 2018, @license_plate = 'TO-4151', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.3L EcoBoost I4 (310 hp, 350 lb-ft), 4x4, 10-Speed Auto, Trail Control, Digital Cluster, SYNC 4 Infotainment, 360° Camera', @status_id = 1, @odometer_reading = 12015, @price_per_hour = 112, @image_path = 'src/img/avalon.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Sienna', @brand = 'Toyota', @transmission = 'Automatic', @year = 2019, @license_plate = 'TO-6042', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.0L Biturbo V6 (429 hp, 384 lb-ft), RWD, 9-Speed Auto, Air Suspension, Burmester 3D Sound, Night Vision Assist, Active Lane Keeping', @status_id = 1, @odometer_reading = 2527, @price_per_hour = 121, @image_path = 'src/img/sienna.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = '4Runner', @brand = 'Toyota', @transmission = 'Automatic', @year = 2018, @license_plate = 'TO-8548', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Single-Motor RWD (201 hp, 236 lb-ft), Single-Speed, Heated Cloth Seats, 10.1" Touchscreen, Wireless Charging, Traffic Jam Assist', @status_id = 1, @odometer_reading = 9572, @price_per_hour = 133, @image_path = 'src/img/4runner.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Swift', @brand = 'Suzuki', @transmission = 'Automatic', @year = 2022, @license_plate = 'SU-6715', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.0L Turbocharged I4 (250 hp, 273 lb-ft), AWD, 8-Speed Auto, Leather Seats, Panoramic Sunroof, Wireless Apple CarPlay/Android Auto, Blind-Spot Monitor', @status_id = 1, @odometer_reading = 3751, @price_per_hour = 197, @image_path = 'src/img/swift.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Baleno', @brand = 'Suzuki', @transmission = 'Automatic', @year = 2022, @license_plate = 'SU-6239', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.5L V6 (310 hp, 280 lb-ft), RWD, 10-Speed Auto, Heated/Cooled Front Seats, 12-Speaker Bose Audio, Heads-Up Display, Adaptive Cruise Control', @status_id = 1, @odometer_reading = 7305, @price_per_hour = 192, @image_path = 'src/img/baleno.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Dzire', @brand = 'Suzuki', @transmission = 'Automatic', @year = 2020, @license_plate = 'SU-4652', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Dual-Motor AWD (402 hp, 479 lb-ft), Single-Speed Auto, Vegan Leather, 15" Touchscreen Nav, Regenerative Braking, Lane-Keep Assist', @status_id = 1, @odometer_reading = 5521, @price_per_hour = 163, @image_path = 'src/img/dzire.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Vitara', @brand = 'Suzuki', @transmission = 'Automatic', @year = 2020, @license_plate = 'SU-6791', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '4.0L V8 (621 hp, 443 lb-ft), RWD, 7-Speed DCT, Carbon-Ceramic Brakes, Sports Exhaust, Carbon-Fiber Trim, Launch Control', @status_id = 1, @odometer_reading = 17970, @price_per_hour = 134, @image_path = 'src/img/vitara.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Jimny', @brand = 'Suzuki', @transmission = 'Automatic', @year = 2019, @license_plate = 'SU-6529', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '1.6L I4 Hybrid (140 hp total), FWD, CVT, Fabric Sport Seats, Keyless Entry & Start, Rear-view Camera, Forward Collision Warning', @status_id = 1, @odometer_reading = 7379, @price_per_hour = 97, @image_path = 'src/img/jimny.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Ciaz', @brand = 'Suzuki', @transmission = 'Automatic', @year = 2018, @license_plate = 'SU-3657', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '5.2L V10 (602 hp, 413 lb-ft), AWD, 7-Speed Auto, Magnetic Ride Control, Diamond-Stitched Leather, Ceramic Coated Brake Calipers, LED Matrix Headlights', @status_id = 1, @odometer_reading = 29327, @price_per_hour = 180, @image_path = 'src/img/ciaz.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Ignis', @brand = 'Suzuki', @transmission = 'Automatic', @year = 2022, @license_plate = 'SU-9388', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.5L Boxer-4 (228 hp, 184 lb-ft), AWD, CVT, X-Mode Off-road, EyeSight Driver Assist, Heated Steering Wheel, Roof Rails', @status_id = 1, @odometer_reading = 9220, @price_per_hour = 98, @image_path = 'src/img/ignis.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'S-Cross', @brand = 'Suzuki', @transmission = 'Automatic', @year = 2017, @license_plate = 'SU-9493', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.3L EcoBoost I4 (310 hp, 350 lb-ft), 4x4, 10-Speed Auto, Trail Control, Digital Cluster, SYNC 4 Infotainment, 360° Camera', @status_id = 1, @odometer_reading = 14487, @price_per_hour = 192, @image_path = 'src/img/s-cross.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Ertiga', @brand = 'Suzuki', @transmission = 'Automatic', @year = 2018, @license_plate = 'SU-4784', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.0L Biturbo V6 (429 hp, 384 lb-ft), RWD, 9-Speed Auto, Air Suspension, Burmester 3D Sound, Night Vision Assist, Active Lane Keeping', @status_id = 1, @odometer_reading = 3507, @price_per_hour = 155, @image_path = 'src/img/ertiga.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'XL6', @brand = 'Suzuki', @transmission = 'Automatic', @year = 2018, @license_plate = 'SU-6423', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Single-Motor RWD (201 hp, 236 lb-ft), Single-Speed, Heated Cloth Seats, 10.1" Touchscreen, Wireless Charging, Traffic Jam Assist', @status_id = 1, @odometer_reading = 21914, @price_per_hour = 94, @image_path = 'src/img/xl6.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Civic', @brand = 'Honda', @transmission = 'Automatic', @year = 2021, @license_plate = 'HO-4223', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.0L Turbocharged I4 (250 hp, 273 lb-ft), AWD, 8-Speed Auto, Leather Seats, Panoramic Sunroof, Wireless Apple CarPlay/Android Auto, Blind-Spot Monitor', @status_id = 1, @odometer_reading = 15179, @price_per_hour = 85, @image_path = 'src/img/civic.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Accord', @brand = 'Honda', @transmission = 'Automatic', @year = 2022, @license_plate = 'HO-7128', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.5L V6 (310 hp, 280 lb-ft), RWD, 10-Speed Auto, Heated/Cooled Front Seats, 12-Speaker Bose Audio, Heads-Up Display, Adaptive Cruise Control', @status_id = 1, @odometer_reading = 17815, @price_per_hour = 136, @image_path = 'src/img/accord.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'CR-V', @brand = 'Honda', @transmission = 'Automatic', @year = 2017, @license_plate = 'HO-1203', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Dual-Motor AWD (402 hp, 479 lb-ft), Single-Speed Auto, Vegan Leather, 15" Touchscreen Nav, Regenerative Braking, Lane-Keep Assist', @status_id = 1, @odometer_reading = 2717, @price_per_hour = 169, @image_path = 'src/img/cr-v.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Pilot', @brand = 'Honda', @transmission = 'Automatic', @year = 2019, @license_plate = 'HO-5104', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '4.0L V8 (621 hp, 443 lb-ft), RWD, 7-Speed DCT, Carbon-Ceramic Brakes, Sports Exhaust, Carbon-Fiber Trim, Launch Control', @status_id = 1, @odometer_reading = 16927, @price_per_hour = 193, @image_path = 'src/img/pilot.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'HR-V', @brand = 'Honda', @transmission = 'Automatic', @year = 2019, @license_plate = 'HO-4276', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '1.6L I4 Hybrid (140 hp total), FWD, CVT, Fabric Sport Seats, Keyless Entry & Start, Rear-view Camera, Forward Collision Warning', @status_id = 1, @odometer_reading = 6916, @price_per_hour = 82, @image_path = 'src/img/hr-v.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Ridgeline', @brand = 'Honda', @transmission = 'Automatic', @year = 2020, @license_plate = 'HO-9917', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '5.2L V10 (602 hp, 413 lb-ft), AWD, 7-Speed Auto, Magnetic Ride Control, Diamond-Stitched Leather, Ceramic Coated Brake Calipers, LED Matrix Headlights', @status_id = 1, @odometer_reading = 16113, @price_per_hour = 92, @image_path = 'src/img/ridgeline.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Odyssey', @brand = 'Honda', @transmission = 'Automatic', @year = 2021, @license_plate = 'HO-7689', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.5L Boxer-4 (228 hp, 184 lb-ft), AWD, CVT, X-Mode Off-road, EyeSight Driver Assist, Heated Steering Wheel, Roof Rails', @status_id = 1, @odometer_reading = 20046, @price_per_hour = 116, @image_path = 'src/img/odyssey.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Fit', @brand = 'Honda', @transmission = 'Automatic', @year = 2018, @license_plate = 'HO-8689', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.3L EcoBoost I4 (310 hp, 350 lb-ft), 4x4, 10-Speed Auto, Trail Control, Digital Cluster, SYNC 4 Infotainment, 360° Camera', @status_id = 1, @odometer_reading = 11067, @price_per_hour = 168, @image_path = 'src/img/fit.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Insight', @brand = 'Honda', @transmission = 'Automatic', @year = 2019, @license_plate = 'HO-5775', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.0L Biturbo V6 (429 hp, 384 lb-ft), RWD, 9-Speed Auto, Air Suspension, Burmester 3D Sound, Night Vision Assist, Active Lane Keeping', @status_id = 1, @odometer_reading = 14595, @price_per_hour = 193, @image_path = 'src/img/insight.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Passport', @brand = 'Honda', @transmission = 'Automatic', @year = 2016, @license_plate = 'HO-3233', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Single-Motor RWD (201 hp, 236 lb-ft), Single-Speed, Heated Cloth Seats, 10.1" Touchscreen, Wireless Charging, Traffic Jam Assist', @status_id = 1, @odometer_reading = 8660, @price_per_hour = 180, @image_path = 'src/img/passport.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Aventador', @brand = 'Lamborghini', @transmission = 'Automatic', @year = 2016, @license_plate = 'LA-5240', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.0L Turbocharged I4 (250 hp, 273 lb-ft), AWD, 8-Speed Auto, Leather Seats, Panoramic Sunroof, Wireless Apple CarPlay/Android Auto, Blind-Spot Monitor', @status_id = 1, @odometer_reading = 8019, @price_per_hour = 128, @image_path = 'src/img/aventador.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Huracan', @brand = 'Lamborghini', @transmission = 'Automatic', @year = 2020, @license_plate = 'LA-3479', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.5L V6 (310 hp, 280 lb-ft), RWD, 10-Speed Auto, Heated/Cooled Front Seats, 12-Speaker Bose Audio, Heads-Up Display, Adaptive Cruise Control', @status_id = 1, @odometer_reading = 21292, @price_per_hour = 98, @image_path = 'src/img/huracan.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Urus', @brand = 'Lamborghini', @transmission = 'Automatic', @year = 2022, @license_plate = 'LA-6066', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Dual-Motor AWD (402 hp, 479 lb-ft), Single-Speed Auto, Vegan Leather, 15" Touchscreen Nav, Regenerative Braking, Lane-Keep Assist', @status_id = 1, @odometer_reading = 24693, @price_per_hour = 193, @image_path = 'src/img/urus.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Sian', @brand = 'Lamborghini', @transmission = 'Automatic', @year = 2022, @license_plate = 'LA-3104', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '4.0L V8 (621 hp, 443 lb-ft), RWD, 7-Speed DCT, Carbon-Ceramic Brakes, Sports Exhaust, Carbon-Fiber Trim, Launch Control', @status_id = 1, @odometer_reading = 16535, @price_per_hour = 178, @image_path = 'src/img/sian.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Countach', @brand = 'Lamborghini', @transmission = 'Automatic', @year = 2019, @license_plate = 'LA-7692', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '1.6L I4 Hybrid (140 hp total), FWD, CVT, Fabric Sport Seats, Keyless Entry & Start, Rear-view Camera, Forward Collision Warning', @status_id = 1, @odometer_reading = 15424, @price_per_hour = 194, @image_path = 'src/img/countach.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Diablo', @brand = 'Lamborghini', @transmission = 'Automatic', @year = 2020, @license_plate = 'LA-8328', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '5.2L V10 (602 hp, 413 lb-ft), AWD, 7-Speed Auto, Magnetic Ride Control, Diamond-Stitched Leather, Ceramic Coated Brake Calipers, LED Matrix Headlights', @status_id = 1, @odometer_reading = 13813, @price_per_hour = 98, @image_path = 'src/img/diablo.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Murcielago', @brand = 'Lamborghini', @transmission = 'Automatic', @year = 2016, @license_plate = 'LA-2187', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.5L Boxer-4 (228 hp, 184 lb-ft), AWD, CVT, X-Mode Off-road, EyeSight Driver Assist, Heated Steering Wheel, Roof Rails', @status_id = 1, @odometer_reading = 12532, @price_per_hour = 176, @image_path = 'src/img/murcielago.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Gallardo', @brand = 'Lamborghini', @transmission = 'Automatic', @year = 2017, @license_plate = 'LA-9844', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.3L EcoBoost I4 (310 hp, 350 lb-ft), 4x4, 10-Speed Auto, Trail Control, Digital Cluster, SYNC 4 Infotainment, 360° Camera', @status_id = 1, @odometer_reading = 13329, @price_per_hour = 131, @image_path = 'src/img/gallardo.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Reventon', @brand = 'Lamborghini', @transmission = 'Automatic', @year = 2020, @license_plate = 'LA-8346', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.0L Biturbo V6 (429 hp, 384 lb-ft), RWD, 9-Speed Auto, Air Suspension, Burmester 3D Sound, Night Vision Assist, Active Lane Keeping', @status_id = 1, @odometer_reading = 12596, @price_per_hour = 129, @image_path = 'src/img/reventon.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Veneno', @brand = 'Lamborghini', @transmission = 'Automatic', @year = 2017, @license_plate = 'LA-9910', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Single-Motor RWD (201 hp, 236 lb-ft), Single-Speed, Heated Cloth Seats, 10.1" Touchscreen, Wireless Charging, Traffic Jam Assist', @status_id = 1, @odometer_reading = 28228, @price_per_hour = 90, @image_path = 'src/img/veneno.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = '488', @brand = 'Ferrari', @transmission = 'Automatic', @year = 2018, @license_plate = 'FE-8442', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.0L Turbocharged I4 (250 hp, 273 lb-ft), AWD, 8-Speed Auto, Leather Seats, Panoramic Sunroof, Wireless Apple CarPlay/Android Auto, Blind-Spot Monitor', @status_id = 1, @odometer_reading = 28879, @price_per_hour = 188, @image_path = 'src/img/488.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'F8', @brand = 'Ferrari', @transmission = 'Automatic', @year = 2022, @license_plate = 'FE-4604', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.5L V6 (310 hp, 280 lb-ft), RWD, 10-Speed Auto, Heated/Cooled Front Seats, 12-Speaker Bose Audio, Heads-Up Display, Adaptive Cruise Control', @status_id = 1, @odometer_reading = 11227, @price_per_hour = 187, @image_path = 'src/img/f8.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Roma', @brand = 'Ferrari', @transmission = 'Automatic', @year = 2018, @license_plate = 'FE-8518', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Dual-Motor AWD (402 hp, 479 lb-ft), Single-Speed Auto, Vegan Leather, 15" Touchscreen Nav, Regenerative Braking, Lane-Keep Assist', @status_id = 1, @odometer_reading = 9725, @price_per_hour = 158, @image_path = 'src/img/roma.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Portofino', @brand = 'Ferrari', @transmission = 'Automatic', @year = 2017, @license_plate = 'FE-9664', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '4.0L V8 (621 hp, 443 lb-ft), RWD, 7-Speed DCT, Carbon-Ceramic Brakes, Sports Exhaust, Carbon-Fiber Trim, Launch Control', @status_id = 1, @odometer_reading = 25800, @price_per_hour = 120, @image_path = 'src/img/portofino.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'SF90', @brand = 'Ferrari', @transmission = 'Automatic', @year = 2021, @license_plate = 'FE-3571', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '1.6L I4 Hybrid (140 hp total), FWD, CVT, Fabric Sport Seats, Keyless Entry & Start, Rear-view Camera, Forward Collision Warning', @status_id = 1, @odometer_reading = 8080, @price_per_hour = 159, @image_path = 'src/img/sf90.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = '296', @brand = 'Ferrari', @transmission = 'Automatic', @year = 2020, @license_plate = 'FE-7637', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '5.2L V10 (602 hp, 413 lb-ft), AWD, 7-Speed Auto, Magnetic Ride Control, Diamond-Stitched Leather, Ceramic Coated Brake Calipers, LED Matrix Headlights', @status_id = 1, @odometer_reading = 28550, @price_per_hour = 119, @image_path = 'src/img/296.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = '812', @brand = 'Ferrari', @transmission = 'Automatic', @year = 2019, @license_plate = 'FE-5640', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.5L Boxer-4 (228 hp, 184 lb-ft), AWD, CVT, X-Mode Off-road, EyeSight Driver Assist, Heated Steering Wheel, Roof Rails', @status_id = 1, @odometer_reading = 9343, @price_per_hour = 116, @image_path = 'src/img/812.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'LaFerrari', @brand = 'Ferrari', @transmission = 'Automatic', @year = 2020, @license_plate = 'FE-8704', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.3L EcoBoost I4 (310 hp, 350 lb-ft), 4x4, 10-Speed Auto, Trail Control, Digital Cluster, SYNC 4 Infotainment, 360° Camera', @status_id = 1, @odometer_reading = 5148, @price_per_hour = 132, @image_path = 'src/img/laferrari.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Enzo', @brand = 'Ferrari', @transmission = 'Automatic', @year = 2016, @license_plate = 'FE-1312', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.0L Biturbo V6 (429 hp, 384 lb-ft), RWD, 9-Speed Auto, Air Suspension, Burmester 3D Sound, Night Vision Assist, Active Lane Keeping', @status_id = 1, @odometer_reading = 22514, @price_per_hour = 170, @image_path = 'src/img/enzo.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'F40', @brand = 'Ferrari', @transmission = 'Automatic', @year = 2016, @license_plate = 'FE-7397', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Single-Motor RWD (201 hp, 236 lb-ft), Single-Speed, Heated Cloth Seats, 10.1" Touchscreen, Wireless Charging, Traffic Jam Assist', @status_id = 1, @odometer_reading = 29962, @price_per_hour = 156, @image_path = 'src/img/f40.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'A-Class', @brand = 'Mercedes', @transmission = 'Automatic', @year = 2019, @license_plate = 'ME-9102', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.0L Turbocharged I4 (250 hp, 273 lb-ft), AWD, 8-Speed Auto, Leather Seats, Panoramic Sunroof, Wireless Apple CarPlay/Android Auto, Blind-Spot Monitor', @status_id = 1, @odometer_reading = 20692, @price_per_hour = 102, @image_path = 'src/img/a-class.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'C-Class', @brand = 'Mercedes', @transmission = 'Automatic', @year = 2020, @license_plate = 'ME-9287', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.5L V6 (310 hp, 280 lb-ft), RWD, 10-Speed Auto, Heated/Cooled Front Seats, 12-Speaker Bose Audio, Heads-Up Display, Adaptive Cruise Control', @status_id = 1, @odometer_reading = 10638, @price_per_hour = 99, @image_path = 'src/img/c-class.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'E-Class', @brand = 'Mercedes', @transmission = 'Automatic', @year = 2017, @license_plate = 'ME-9064', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Dual-Motor AWD (402 hp, 479 lb-ft), Single-Speed Auto, Vegan Leather, 15" Touchscreen Nav, Regenerative Braking, Lane-Keep Assist', @status_id = 1, @odometer_reading = 18508, @price_per_hour = 165, @image_path = 'src/img/e-class.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'S-Class', @brand = 'Mercedes', @transmission = 'Automatic', @year = 2020, @license_plate = 'ME-6365', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '4.0L V8 (621 hp, 443 lb-ft), RWD, 7-Speed DCT, Carbon-Ceramic Brakes, Sports Exhaust, Carbon-Fiber Trim, Launch Control', @status_id = 1, @odometer_reading = 17636, @price_per_hour = 116, @image_path = 'src/img/s-class.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'GLA', @brand = 'Mercedes', @transmission = 'Automatic', @year = 2019, @license_plate = 'ME-4065', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '1.6L I4 Hybrid (140 hp total), FWD, CVT, Fabric Sport Seats, Keyless Entry & Start, Rear-view Camera, Forward Collision Warning', @status_id = 1, @odometer_reading = 17252, @price_per_hour = 147, @image_path = 'src/img/gla.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'GLC', @brand = 'Mercedes', @transmission = 'Automatic', @year = 2016, @license_plate = 'ME-5712', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '5.2L V10 (602 hp, 413 lb-ft), AWD, 7-Speed Auto, Magnetic Ride Control, Diamond-Stitched Leather, Ceramic Coated Brake Calipers, LED Matrix Headlights', @status_id = 1, @odometer_reading = 21254, @price_per_hour = 104, @image_path = 'src/img/glc.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'GLE', @brand = 'Mercedes', @transmission = 'Automatic', @year = 2020, @license_plate = 'ME-9355', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.5L Boxer-4 (228 hp, 184 lb-ft), AWD, CVT, X-Mode Off-road, EyeSight Driver Assist, Heated Steering Wheel, Roof Rails', @status_id = 1, @odometer_reading = 23209, @price_per_hour = 178, @image_path = 'src/img/gle.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'GLS', @brand = 'Mercedes', @transmission = 'Automatic', @year = 2019, @license_plate = 'ME-8954', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.3L EcoBoost I4 (310 hp, 350 lb-ft), 4x4, 10-Speed Auto, Trail Control, Digital Cluster, SYNC 4 Infotainment, 360° Camera', @status_id = 1, @odometer_reading = 1518, @price_per_hour = 131, @image_path = 'src/img/gls.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'G-Class', @brand = 'Mercedes', @transmission = 'Automatic', @year = 2021, @license_plate = 'ME-1153', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.0L Biturbo V6 (429 hp, 384 lb-ft), RWD, 9-Speed Auto, Air Suspension, Burmester 3D Sound, Night Vision Assist, Active Lane Keeping', @status_id = 1, @odometer_reading = 16847, @price_per_hour = 196, @image_path = 'src/img/g-class.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'CLA', @brand = 'Mercedes', @transmission = 'Automatic', @year = 2022, @license_plate = 'ME-2504', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Single-Motor RWD (201 hp, 236 lb-ft), Single-Speed, Heated Cloth Seats, 10.1" Touchscreen, Wireless Charging, Traffic Jam Assist', @status_id = 1, @odometer_reading = 15350, @price_per_hour = 195, @image_path = 'src/img/cla.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Huayra', @brand = 'Pagani', @transmission = 'Automatic', @year = 2017, @license_plate = 'PA-6470', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.0L Turbocharged I4 (250 hp, 273 lb-ft), AWD, 8-Speed Auto, Leather Seats, Panoramic Sunroof, Wireless Apple CarPlay/Android Auto, Blind-Spot Monitor', @status_id = 1, @odometer_reading = 6422, @price_per_hour = 200, @image_path = 'src/img/huayra.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Zonda', @brand = 'Pagani', @transmission = 'Automatic', @year = 2018, @license_plate = 'PA-7293', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.5L V6 (310 hp, 280 lb-ft), RWD, 10-Speed Auto, Heated/Cooled Front Seats, 12-Speaker Bose Audio, Heads-Up Display, Adaptive Cruise Control', @status_id = 1, @odometer_reading = 26028, @price_per_hour = 174, @image_path = 'src/img/zonda.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Utopia', @brand = 'Pagani', @transmission = 'Automatic', @year = 2018, @license_plate = 'PA-9019', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Dual-Motor AWD (402 hp, 479 lb-ft), Single-Speed Auto, Vegan Leather, 15" Touchscreen Nav, Regenerative Braking, Lane-Keep Assist', @status_id = 1, @odometer_reading = 20345, @price_per_hour = 160, @image_path = 'src/img/utopia.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Huayra R', @brand = 'Pagani', @transmission = 'Automatic', @year = 2022, @license_plate = 'PA-8872', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '4.0L V8 (621 hp, 443 lb-ft), RWD, 7-Speed DCT, Carbon-Ceramic Brakes, Sports Exhaust, Carbon-Fiber Trim, Launch Control', @status_id = 1, @odometer_reading = 11414, @price_per_hour = 100, @image_path = 'src/img/huayra_r.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Zonda R', @brand = 'Pagani', @transmission = 'Automatic', @year = 2016, @license_plate = 'PA-8467', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '1.6L I4 Hybrid (140 hp total), FWD, CVT, Fabric Sport Seats, Keyless Entry & Start, Rear-view Camera, Forward Collision Warning', @status_id = 1, @odometer_reading = 4681, @price_per_hour = 124, @image_path = 'src/img/zonda_r.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Huayra BC', @brand = 'Pagani', @transmission = 'Automatic', @year = 2021, @license_plate = 'PA-1237', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '5.2L V10 (602 hp, 413 lb-ft), AWD, 7-Speed Auto, Magnetic Ride Control, Diamond-Stitched Leather, Ceramic Coated Brake Calipers, LED Matrix Headlights', @status_id = 1, @odometer_reading = 18865, @price_per_hour = 129, @image_path = 'src/img/huayra_bc.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Zonda Cinque', @brand = 'Pagani', @transmission = 'Automatic', @year = 2019, @license_plate = 'PA-4242', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.5L Boxer-4 (228 hp, 184 lb-ft), AWD, CVT, X-Mode Off-road, EyeSight Driver Assist, Heated Steering Wheel, Roof Rails', @status_id = 1, @odometer_reading = 18958, @price_per_hour = 135, @image_path = 'src/img/zonda_cinque.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Huayra Roadster', @brand = 'Pagani', @transmission = 'Automatic', @year = 2020, @license_plate = 'PA-5069', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.3L EcoBoost I4 (310 hp, 350 lb-ft), 4x4, 10-Speed Auto, Trail Control, Digital Cluster, SYNC 4 Infotainment, 360° Camera', @status_id = 1, @odometer_reading = 11426, @price_per_hour = 122, @image_path = 'src/img/huayra_roadster.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Zonda F', @brand = 'Pagani', @transmission = 'Automatic', @year = 2021, @license_plate = 'PA-2283', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.0L Biturbo V6 (429 hp, 384 lb-ft), RWD, 9-Speed Auto, Air Suspension, Burmester 3D Sound, Night Vision Assist, Active Lane Keeping', @status_id = 1, @odometer_reading = 3847, @price_per_hour = 120, @image_path = 'src/img/zonda_f.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Huayra Tempesta', @brand = 'Pagani', @transmission = 'Automatic', @year = 2022, @license_plate = 'PA-1998', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Single-Motor RWD (201 hp, 236 lb-ft), Single-Speed, Heated Cloth Seats, 10.1" Touchscreen, Wireless Charging, Traffic Jam Assist', @status_id = 1, @odometer_reading = 28826, @price_per_hour = 93, @image_path = 'src/img/huayra_tempesta.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Chiron', @brand = 'Bugatti', @transmission = 'Automatic', @year = 2016, @license_plate = 'BU-1222', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.0L Turbocharged I4 (250 hp, 273 lb-ft), AWD, 8-Speed Auto, Leather Seats, Panoramic Sunroof, Wireless Apple CarPlay/Android Auto, Blind-Spot Monitor', @status_id = 1, @odometer_reading = 20859, @price_per_hour = 131, @image_path = 'src/img/chiron.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Veyron', @brand = 'Bugatti', @transmission = 'Automatic', @year = 2021, @license_plate = 'BU-5535', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.5L V6 (310 hp, 280 lb-ft), RWD, 10-Speed Auto, Heated/Cooled Front Seats, 12-Speaker Bose Audio, Heads-Up Display, Adaptive Cruise Control', @status_id = 1, @odometer_reading = 10607, @price_per_hour = 163, @image_path = 'src/img/veyron.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Divo', @brand = 'Bugatti', @transmission = 'Automatic', @year = 2021, @license_plate = 'BU-7685', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Dual-Motor AWD (402 hp, 479 lb-ft), Single-Speed Auto, Vegan Leather, 15" Touchscreen Nav, Regenerative Braking, Lane-Keep Assist', @status_id = 1, @odometer_reading = 13632, @price_per_hour = 143, @image_path = 'src/img/divo.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Centodieci', @brand = 'Bugatti', @transmission = 'Automatic', @year = 2016, @license_plate = 'BU-9715', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '4.0L V8 (621 hp, 443 lb-ft), RWD, 7-Speed DCT, Carbon-Ceramic Brakes, Sports Exhaust, Carbon-Fiber Trim, Launch Control', @status_id = 1, @odometer_reading = 27584, @price_per_hour = 189, @image_path = 'src/img/centodieci.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Bolide', @brand = 'Bugatti', @transmission = 'Automatic', @year = 2021, @license_plate = 'BU-9168', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '1.6L I4 Hybrid (140 hp total), FWD, CVT, Fabric Sport Seats, Keyless Entry & Start, Rear-view Camera, Forward Collision Warning', @status_id = 1, @odometer_reading = 6709, @price_per_hour = 136, @image_path = 'src/img/bolide.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'La Voiture Noire', @brand = 'Bugatti', @transmission = 'Automatic', @year = 2022, @license_plate = 'BU-2671', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '5.2L V10 (602 hp, 413 lb-ft), AWD, 7-Speed Auto, Magnetic Ride Control, Diamond-Stitched Leather, Ceramic Coated Brake Calipers, LED Matrix Headlights', @status_id = 1, @odometer_reading = 10081, @price_per_hour = 103, @image_path = 'src/img/la_voiture_noire.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Chiron Super Sport', @brand = 'Bugatti', @transmission = 'Automatic', @year = 2022, @license_plate = 'BU-6633', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.5L Boxer-4 (228 hp, 184 lb-ft), AWD, CVT, X-Mode Off-road, EyeSight Driver Assist, Heated Steering Wheel, Roof Rails', @status_id = 1, @odometer_reading = 6402, @price_per_hour = 118, @image_path = 'src/img/chiron_super_sport.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Veyron Super Sport', @brand = 'Bugatti', @transmission = 'Automatic', @year = 2017, @license_plate = 'BU-9984', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.3L EcoBoost I4 (310 hp, 350 lb-ft), 4x4, 10-Speed Auto, Trail Control, Digital Cluster, SYNC 4 Infotainment, 360° Camera', @status_id = 1, @odometer_reading = 27476, @price_per_hour = 192, @image_path = 'src/img/veyron_super_sport.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Chiron Pur Sport', @brand = 'Bugatti', @transmission = 'Automatic', @year = 2022, @license_plate = 'BU-1971', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.0L Biturbo V6 (429 hp, 384 lb-ft), RWD, 9-Speed Auto, Air Suspension, Burmester 3D Sound, Night Vision Assist, Active Lane Keeping', @status_id = 1, @odometer_reading = 16299, @price_per_hour = 92, @image_path = 'src/img/chiron_pur_sport.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'EB110', @brand = 'Bugatti', @transmission = 'Automatic', @year = 2017, @license_plate = 'BU-1107', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Single-Motor RWD (201 hp, 236 lb-ft), Single-Speed, Heated Cloth Seats, 10.1" Touchscreen, Wireless Charging, Traffic Jam Assist', @status_id = 1, @odometer_reading = 15107, @price_per_hour = 145, @image_path = 'src/img/eb110.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Seltos', @brand = 'Kia', @transmission = 'Automatic', @year = 2019, @license_plate = 'KI-6496', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.0L Turbocharged I4 (250 hp, 273 lb-ft), AWD, 8-Speed Auto, Leather Seats, Panoramic Sunroof, Wireless Apple CarPlay/Android Auto, Blind-Spot Monitor', @status_id = 1, @odometer_reading = 23734, @price_per_hour = 82, @image_path = 'src/img/seltos.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Soul', @brand = 'Kia', @transmission = 'Automatic', @year = 2021, @license_plate = 'KI-1656', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.5L V6 (310 hp, 280 lb-ft), RWD, 10-Speed Auto, Heated/Cooled Front Seats, 12-Speaker Bose Audio, Heads-Up Display, Adaptive Cruise Control', @status_id = 1, @odometer_reading = 11842, @price_per_hour = 113, @image_path = 'src/img/soul.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Forte', @brand = 'Kia', @transmission = 'Automatic', @year = 2021, @license_plate = 'KI-3716', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Dual-Motor AWD (402 hp, 479 lb-ft), Single-Speed Auto, Vegan Leather, 15" Touchscreen Nav, Regenerative Braking, Lane-Keep Assist', @status_id = 1, @odometer_reading = 3360, @price_per_hour = 156, @image_path = 'src/img/forte.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Rio', @brand = 'Kia', @transmission = 'Automatic', @year = 2020, @license_plate = 'KI-5911', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '4.0L V8 (621 hp, 443 lb-ft), RWD, 7-Speed DCT, Carbon-Ceramic Brakes, Sports Exhaust, Carbon-Fiber Trim, Launch Control', @status_id = 1, @odometer_reading = 28360, @price_per_hour = 117, @image_path = 'src/img/rio.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Optima', @brand = 'Kia', @transmission = 'Automatic', @year = 2016, @license_plate = 'KI-8104', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '1.6L I4 Hybrid (140 hp total), FWD, CVT, Fabric Sport Seats, Keyless Entry & Start, Rear-view Camera, Forward Collision Warning', @status_id = 1, @odometer_reading = 15367, @price_per_hour = 194, @image_path = 'src/img/optima.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Stinger', @brand = 'Kia', @transmission = 'Automatic', @year = 2019, @license_plate = 'KI-9550', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '5.2L V10 (602 hp, 413 lb-ft), AWD, 7-Speed Auto, Magnetic Ride Control, Diamond-Stitched Leather, Ceramic Coated Brake Calipers, LED Matrix Headlights', @status_id = 1, @odometer_reading = 17628, @price_per_hour = 175, @image_path = 'src/img/stinger.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Carnival', @brand = 'Kia', @transmission = 'Automatic', @year = 2017, @license_plate = 'KI-5608', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.5L Boxer-4 (228 hp, 184 lb-ft), AWD, CVT, X-Mode Off-road, EyeSight Driver Assist, Heated Steering Wheel, Roof Rails', @status_id = 1, @odometer_reading = 4781, @price_per_hour = 157, @image_path = 'src/img/carnival.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Sorento', @brand = 'Kia', @transmission = 'Automatic', @year = 2022, @license_plate = 'KI-8275', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.3L EcoBoost I4 (310 hp, 350 lb-ft), 4x4, 10-Speed Auto, Trail Control, Digital Cluster, SYNC 4 Infotainment, 360° Camera', @status_id = 1, @odometer_reading = 9788, @price_per_hour = 127, @image_path = 'src/img/sorento.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Telluride', @brand = 'Kia', @transmission = 'Automatic', @year = 2017, @license_plate = 'KI-5195', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.0L Biturbo V6 (429 hp, 384 lb-ft), RWD, 9-Speed Auto, Air Suspension, Burmester 3D Sound, Night Vision Assist, Active Lane Keeping', @status_id = 1, @odometer_reading = 9672, @price_per_hour = 96, @image_path = 'src/img/telluride.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Sportage', @brand = 'Kia', @transmission = 'Automatic', @year = 2016, @license_plate = 'KI-8306', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Single-Motor RWD (201 hp, 236 lb-ft), Single-Speed, Heated Cloth Seats, 10.1" Touchscreen, Wireless Charging, Traffic Jam Assist', @status_id = 1, @odometer_reading = 21001, @price_per_hour = 86, @image_path = 'src/img/sportage.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Mazda3', @brand = 'Mazda', @transmission = 'Automatic', @year = 2017, @license_plate = 'MA-4263', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.0L Turbocharged I4 (250 hp, 273 lb-ft), AWD, 8-Speed Auto, Leather Seats, Panoramic Sunroof, Wireless Apple CarPlay/Android Auto, Blind-Spot Monitor', @status_id = 1, @odometer_reading = 13614, @price_per_hour = 139, @image_path = 'src/img/mazda3.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Mazda6', @brand = 'Mazda', @transmission = 'Automatic', @year = 2018, @license_plate = 'MA-1786', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.5L V6 (310 hp, 280 lb-ft), RWD, 10-Speed Auto, Heated/Cooled Front Seats, 12-Speaker Bose Audio, Heads-Up Display, Adaptive Cruise Control', @status_id = 1, @odometer_reading = 21179, @price_per_hour = 110, @image_path = 'src/img/mazda6.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'CX-3', @brand = 'Mazda', @transmission = 'Automatic', @year = 2017, @license_plate = 'MA-7591', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Dual-Motor AWD (402 hp, 479 lb-ft), Single-Speed Auto, Vegan Leather, 15" Touchscreen Nav, Regenerative Braking, Lane-Keep Assist', @status_id = 1, @odometer_reading = 4175, @price_per_hour = 109, @image_path = 'src/img/cx-3.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'CX-30', @brand = 'Mazda', @transmission = 'Automatic', @year = 2021, @license_plate = 'MA-3063', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '4.0L V8 (621 hp, 443 lb-ft), RWD, 7-Speed DCT, Carbon-Ceramic Brakes, Sports Exhaust, Carbon-Fiber Trim, Launch Control', @status_id = 1, @odometer_reading = 26067, @price_per_hour = 188, @image_path = 'src/img/cx-30.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'CX-5', @brand = 'Mazda', @transmission = 'Automatic', @year = 2021, @license_plate = 'MA-9910', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '1.6L I4 Hybrid (140 hp total), FWD, CVT, Fabric Sport Seats, Keyless Entry & Start, Rear-view Camera, Forward Collision Warning', @status_id = 1, @odometer_reading = 29589, @price_per_hour = 100, @image_path = 'src/img/cx-5.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'CX-9', @brand = 'Mazda', @transmission = 'Automatic', @year = 2022, @license_plate = 'MA-8200', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '5.2L V10 (602 hp, 413 lb-ft), AWD, 7-Speed Auto, Magnetic Ride Control, Diamond-Stitched Leather, Ceramic Coated Brake Calipers, LED Matrix Headlights', @status_id = 1, @odometer_reading = 24803, @price_per_hour = 117, @image_path = 'src/img/cx-9.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'MX-5 Miata', @brand = 'Mazda', @transmission = 'Automatic', @year = 2021, @license_plate = 'MA-7447', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.5L Boxer-4 (228 hp, 184 lb-ft), AWD, CVT, X-Mode Off-road, EyeSight Driver Assist, Heated Steering Wheel, Roof Rails', @status_id = 1, @odometer_reading = 2592, @price_per_hour = 106, @image_path = 'src/img/mx-5_miata.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'CX-50', @brand = 'Mazda', @transmission = 'Automatic', @year = 2020, @license_plate = 'MA-5887', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.3L EcoBoost I4 (310 hp, 350 lb-ft), 4x4, 10-Speed Auto, Trail Control, Digital Cluster, SYNC 4 Infotainment, 360° Camera', @status_id = 1, @odometer_reading = 3435, @price_per_hour = 102, @image_path = 'src/img/cx-50.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'CX-60', @brand = 'Mazda', @transmission = 'Automatic', @year = 2017, @license_plate = 'MA-6434', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.0L Biturbo V6 (429 hp, 384 lb-ft), RWD, 9-Speed Auto, Air Suspension, Burmester 3D Sound, Night Vision Assist, Active Lane Keeping', @status_id = 1, @odometer_reading = 21508, @price_per_hour = 198, @image_path = 'src/img/cx-60.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'CX-70', @brand = 'Mazda', @transmission = 'Automatic', @year = 2016, @license_plate = 'MA-6893', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Single-Motor RWD (201 hp, 236 lb-ft), Single-Speed, Heated Cloth Seats, 10.1" Touchscreen, Wireless Charging, Traffic Jam Assist', @status_id = 1, @odometer_reading = 18081, @price_per_hour = 196, @image_path = 'src/img/cx-70.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Altima', @brand = 'Nissan', @transmission = 'Automatic', @year = 2017, @license_plate = 'NI-7577', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.0L Turbocharged I4 (250 hp, 273 lb-ft), AWD, 8-Speed Auto, Leather Seats, Panoramic Sunroof, Wireless Apple CarPlay/Android Auto, Blind-Spot Monitor', @status_id = 1, @odometer_reading = 9718, @price_per_hour = 112, @image_path = 'src/img/altima.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Maxima', @brand = 'Nissan', @transmission = 'Automatic', @year = 2018, @license_plate = 'NI-9095', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.5L V6 (310 hp, 280 lb-ft), RWD, 10-Speed Auto, Heated/Cooled Front Seats, 12-Speaker Bose Audio, Heads-Up Display, Adaptive Cruise Control', @status_id = 1, @odometer_reading = 26853, @price_per_hour = 141, @image_path = 'src/img/maxima.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Sentra', @brand = 'Nissan', @transmission = 'Automatic', @year = 2021, @license_plate = 'NI-4574', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Dual-Motor AWD (402 hp, 479 lb-ft), Single-Speed Auto, Vegan Leather, 15" Touchscreen Nav, Regenerative Braking, Lane-Keep Assist', @status_id = 1, @odometer_reading = 19343, @price_per_hour = 128, @image_path = 'src/img/sentra.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Versa', @brand = 'Nissan', @transmission = 'Automatic', @year = 2019, @license_plate = 'NI-5370', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '4.0L V8 (621 hp, 443 lb-ft), RWD, 7-Speed DCT, Carbon-Ceramic Brakes, Sports Exhaust, Carbon-Fiber Trim, Launch Control', @status_id = 1, @odometer_reading = 16011, @price_per_hour = 165, @image_path = 'src/img/versa.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'GT-R', @brand = 'Nissan', @transmission = 'Automatic', @year = 2021, @license_plate = 'NI-5019', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '1.6L I4 Hybrid (140 hp total), FWD, CVT, Fabric Sport Seats, Keyless Entry & Start, Rear-view Camera, Forward Collision Warning', @status_id = 1, @odometer_reading = 28426, @price_per_hour = 179, @image_path = 'src/img/gt-r.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = '370Z', @brand = 'Nissan', @transmission = 'Automatic', @year = 2018, @license_plate = 'NI-2094', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '5.2L V10 (602 hp, 413 lb-ft), AWD, 7-Speed Auto, Magnetic Ride Control, Diamond-Stitched Leather, Ceramic Coated Brake Calipers, LED Matrix Headlights', @status_id = 1, @odometer_reading = 6327, @price_per_hour = 164, @image_path = 'src/img/370z.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Kicks', @brand = 'Nissan', @transmission = 'Automatic', @year = 2021, @license_plate = 'NI-6152', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.5L Boxer-4 (228 hp, 184 lb-ft), AWD, CVT, X-Mode Off-road, EyeSight Driver Assist, Heated Steering Wheel, Roof Rails', @status_id = 1, @odometer_reading = 3841, @price_per_hour = 96, @image_path = 'src/img/kicks.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Rogue', @brand = 'Nissan', @transmission = 'Automatic', @year = 2018, @license_plate = 'NI-6663', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.3L EcoBoost I4 (310 hp, 350 lb-ft), 4x4, 10-Speed Auto, Trail Control, Digital Cluster, SYNC 4 Infotainment, 360° Camera', @status_id = 1, @odometer_reading = 1133, @price_per_hour = 168, @image_path = 'src/img/rogue.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Murano', @brand = 'Nissan', @transmission = 'Automatic', @year = 2022, @license_plate = 'NI-8038', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.0L Biturbo V6 (429 hp, 384 lb-ft), RWD, 9-Speed Auto, Air Suspension, Burmester 3D Sound, Night Vision Assist, Active Lane Keeping', @status_id = 1, @odometer_reading = 3951, @price_per_hour = 172, @image_path = 'src/img/murano.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Pathfinder', @brand = 'Nissan', @transmission = 'Automatic', @year = 2021, @license_plate = 'NI-5719', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Single-Motor RWD (201 hp, 236 lb-ft), Single-Speed, Heated Cloth Seats, 10.1" Touchscreen, Wireless Charging, Traffic Jam Assist', @status_id = 1, @odometer_reading = 8935, @price_per_hour = 88, @image_path = 'src/img/pathfinder.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'F-150', @brand = 'Ford', @transmission = 'Automatic', @year = 2018, @license_plate = 'FO-6736', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.0L Turbocharged I4 (250 hp, 273 lb-ft), AWD, 8-Speed Auto, Leather Seats, Panoramic Sunroof, Wireless Apple CarPlay/Android Auto, Blind-Spot Monitor', @status_id = 1, @odometer_reading = 27632, @price_per_hour = 167, @image_path = 'src/img/f-150.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Mustang', @brand = 'Ford', @transmission = 'Automatic', @year = 2022, @license_plate = 'FO-6625', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.5L V6 (310 hp, 280 lb-ft), RWD, 10-Speed Auto, Heated/Cooled Front Seats, 12-Speaker Bose Audio, Heads-Up Display, Adaptive Cruise Control', @status_id = 1, @odometer_reading = 25733, @price_per_hour = 96, @image_path = 'src/img/mustang.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Explorer', @brand = 'Ford', @transmission = 'Automatic', @year = 2017, @license_plate = 'FO-9000', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Dual-Motor AWD (402 hp, 479 lb-ft), Single-Speed Auto, Vegan Leather, 15" Touchscreen Nav, Regenerative Braking, Lane-Keep Assist', @status_id = 1, @odometer_reading = 20912, @price_per_hour = 168, @image_path = 'src/img/explorer.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Escape', @brand = 'Ford', @transmission = 'Automatic', @year = 2019, @license_plate = 'FO-6727', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '4.0L V8 (621 hp, 443 lb-ft), RWD, 7-Speed DCT, Carbon-Ceramic Brakes, Sports Exhaust, Carbon-Fiber Trim, Launch Control', @status_id = 1, @odometer_reading = 19260, @price_per_hour = 138, @image_path = 'src/img/escape.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Edge', @brand = 'Ford', @transmission = 'Automatic', @year = 2017, @license_plate = 'FO-4294', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '1.6L I4 Hybrid (140 hp total), FWD, CVT, Fabric Sport Seats, Keyless Entry & Start, Rear-view Camera, Forward Collision Warning', @status_id = 1, @odometer_reading = 11288, @price_per_hour = 96, @image_path = 'src/img/edge.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Bronco', @brand = 'Ford', @transmission = 'Automatic', @year = 2016, @license_plate = 'FO-1848', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '5.2L V10 (602 hp, 413 lb-ft), AWD, 7-Speed Auto, Magnetic Ride Control, Diamond-Stitched Leather, Ceramic Coated Brake Calipers, LED Matrix Headlights', @status_id = 1, @odometer_reading = 18640, @price_per_hour = 90, @image_path = 'src/img/bronco.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Ranger', @brand = 'Ford', @transmission = 'Automatic', @year = 2022, @license_plate = 'FO-6838', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.5L Boxer-4 (228 hp, 184 lb-ft), AWD, CVT, X-Mode Off-road, EyeSight Driver Assist, Heated Steering Wheel, Roof Rails', @status_id = 1, @odometer_reading = 27598, @price_per_hour = 199, @image_path = 'src/img/ranger.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Expedition', @brand = 'Ford', @transmission = 'Automatic', @year = 2019, @license_plate = 'FO-5945', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.3L EcoBoost I4 (310 hp, 350 lb-ft), 4x4, 10-Speed Auto, Trail Control, Digital Cluster, SYNC 4 Infotainment, 360° Camera', @status_id = 1, @odometer_reading = 6486, @price_per_hour = 166, @image_path = 'src/img/expedition.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Maverick', @brand = 'Ford', @transmission = 'Automatic', @year = 2022, @license_plate = 'FO-8314', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.0L Biturbo V6 (429 hp, 384 lb-ft), RWD, 9-Speed Auto, Air Suspension, Burmester 3D Sound, Night Vision Assist, Active Lane Keeping', @status_id = 1, @odometer_reading = 15916, @price_per_hour = 141, @image_path = 'src/img/maverick.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Focus', @brand = 'Ford', @transmission = 'Automatic', @year = 2017, @license_plate = 'FO-2265', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Single-Motor RWD (201 hp, 236 lb-ft), Single-Speed, Heated Cloth Seats, 10.1" Touchscreen, Wireless Charging, Traffic Jam Assist', @status_id = 1, @odometer_reading = 28963, @price_per_hour = 155, @image_path = 'src/img/focus.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'A3', @brand = 'Audi', @transmission = 'Automatic', @year = 2018, @license_plate = 'AU-1582', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.0L Turbocharged I4 (250 hp, 273 lb-ft), AWD, 8-Speed Auto, Leather Seats, Panoramic Sunroof, Wireless Apple CarPlay/Android Auto, Blind-Spot Monitor', @status_id = 1, @odometer_reading = 5607, @price_per_hour = 174, @image_path = 'src/img/a3.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'A4', @brand = 'Audi', @transmission = 'Automatic', @year = 2021, @license_plate = 'AU-5239', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.5L V6 (310 hp, 280 lb-ft), RWD, 10-Speed Auto, Heated/Cooled Front Seats, 12-Speaker Bose Audio, Heads-Up Display, Adaptive Cruise Control', @status_id = 1, @odometer_reading = 10682, @price_per_hour = 86, @image_path = 'src/img/a4.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'A5', @brand = 'Audi', @transmission = 'Automatic', @year = 2019, @license_plate = 'AU-2096', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = 'Electric Dual-Motor AWD (402 hp, 479 lb-ft), Single-Speed Auto, Vegan Leather, 15" Touchscreen Nav, Regenerative Braking, Lane-Keep Assist', @status_id = 1, @odometer_reading = 22312, @price_per_hour = 157, @image_path = 'src/img/a5.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'A6', @brand = 'Audi', @transmission = 'Automatic', @year = 2020, @license_plate = 'AU-9546', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '4.0L V8 (621 hp, 443 lb-ft), RWD, 7-Speed DCT, Carbon-Ceramic Brakes, Sports Exhaust, Carbon-Fiber Trim, Launch Control', @status_id = 1, @odometer_reading = 3120, @price_per_hour = 94, @image_path = 'src/img/a6.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'A7', @brand = 'Audi', @transmission = 'Automatic', @year = 2021, @license_plate = 'AU-9263', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '1.6L I4 Hybrid (140 hp total), FWD, CVT, Fabric Sport Seats, Keyless Entry & Start, Rear-view Camera, Forward Collision Warning', @status_id = 1, @odometer_reading = 6010, @price_per_hour = 150, @image_path = 'src/img/a7.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'A8', @brand = 'Audi', @transmission = 'Automatic', @year = 2017, @license_plate = 'AU-7896', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '5.2L V10 (602 hp, 413 lb-ft), AWD, 7-Speed Auto, Magnetic Ride Control, Diamond-Stitched Leather, Ceramic Coated Brake Calipers, LED Matrix Headlights', @status_id = 1, @odometer_reading = 23015, @price_per_hour = 183, @image_path = 'src/img/a8.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Q3', @brand = 'Audi', @transmission = 'Automatic', @year = 2020, @license_plate = 'AU-2862', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.5L Boxer-4 (228 hp, 184 lb-ft), AWD, CVT, X-Mode Off-road, EyeSight Driver Assist, Heated Steering Wheel, Roof Rails', @status_id = 1, @odometer_reading = 8881, @price_per_hour = 132, @image_path = 'src/img/q3.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Q5', @brand = 'Audi', @transmission = 'Automatic', @year = 2022, @license_plate = 'AU-6245', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '2.3L EcoBoost I4 (310 hp, 350 lb-ft), 4x4, 10-Speed Auto, Trail Control, Digital Cluster, SYNC 4 Infotainment, 360° Camera', @status_id = 1, @odometer_reading = 25864, @price_per_hour = 104, @image_path = 'src/img/q5.png';
EXEC sp_AddCar @car_partner_id = 1, @category = 'SUV', @model = 'Q7', @brand = 'Audi', @transmission = 'Automatic', @year = 2021, @license_plate = 'AU-1909', @color = 'White', @no_seats = 5, @fuel_type = 'Petrol', @features = '3.0L Biturbo V6 (429 hp, 384 lb-ft), RWD, 9-Speed Auto, Air Suspension, Burmester 3D Sound, Night Vision Assist, Active Lane Keeping', @status_id = 1, @odometer_reading = 5248, @price_per_hour = 198, @image_path = 'src/img/q7.png';

--use CarRentalProject_Test

exec sp_RegisterUser
    @username = 'some',
    @password = 'hehe',
    @email = 'mik@gmail.com',
    @role = 'User',
    @status_id = 1

select * from user_status
select * from login_users




select * from scheduling
exec sp_ReportActiveRentals
select * from login_users
