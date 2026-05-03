-- RestaurantMS.API/Scripts/17_Seed.sql
-- Run ONCE to seed initial data (DbUp tracks script history — safe to re-run)
-- Use IF NOT EXISTS guards so it's idempotent

-- 1. Seed Categories
IF NOT EXISTS (SELECT 1 FROM Categories WHERE name = 'Main Course')
    INSERT INTO Categories (name, type) VALUES ('Main Course', 'FOOD');
IF NOT EXISTS (SELECT 1 FROM Categories WHERE name = 'Beverages')
    INSERT INTO Categories (name, type) VALUES ('Beverages', 'DRINK');

-- 2. Seed Manufacturer
IF NOT EXISTS (SELECT 1 FROM Manufacturers WHERE name = 'Internal Kitchen')
    INSERT INTO Manufacturers (name, address, phone)
    VALUES ('Internal Kitchen', 'Kitchen Area', '0000000000');

-- 3. Seed FB items (food & beverages) — use category_id=1 (Main Course)
IF NOT EXISTS (SELECT 1 FROM FBs WHERE name = 'Pho Bo')
    INSERT INTO FBs (name, price, type, category_id, manufacturer_id, is_visible, unit, description)
    VALUES ('Pho Bo', 65000, 'REGULAR', 1, NULL, 1, 'bowl', 'Traditional Vietnamese beef noodle soup');
IF NOT EXISTS (SELECT 1 FROM FBs WHERE name = 'Com Tam')
    INSERT INTO FBs (name, price, type, category_id, manufacturer_id, is_visible, unit, description)
    VALUES ('Com Tam', 55000, 'REGULAR', 1, NULL, 1, 'plate', 'Broken rice with grilled pork');
IF NOT EXISTS (SELECT 1 FROM FBs WHERE name = 'Tra Da')
    INSERT INTO FBs (name, price, type, category_id, manufacturer_id, is_visible, unit, description)
    VALUES ('Tra Da', 10000, 'REGULAR', 2, NULL, 1, 'glass', 'Iced tea');

-- 4. Seed Warehouse rows for each REGULAR FB
DECLARE @fb1 BIGINT = (SELECT fb_id FROM FBs WHERE name = 'Pho Bo');
DECLARE @fb2 BIGINT = (SELECT fb_id FROM FBs WHERE name = 'Com Tam');
DECLARE @fb3 BIGINT = (SELECT fb_id FROM FBs WHERE name = 'Tra Da');

IF NOT EXISTS (SELECT 1 FROM Warehouses WHERE fb_id = @fb1)
    INSERT INTO Warehouses (fb_id, quantity, low_stock_threshold) VALUES (@fb1, 100, 10);
IF NOT EXISTS (SELECT 1 FROM Warehouses WHERE fb_id = @fb2)
    INSERT INTO Warehouses (fb_id, quantity, low_stock_threshold) VALUES (@fb2, 100, 10);
IF NOT EXISTS (SELECT 1 FROM Warehouses WHERE fb_id = @fb3)
    INSERT INTO Warehouses (fb_id, quantity, low_stock_threshold) VALUES (@fb3, 200, 20);

-- 5. Seed Tables
IF NOT EXISTS (SELECT 1 FROM RestaurantTables WHERE capacity = 4)
BEGIN
    INSERT INTO RestaurantTables (status, capacity) VALUES ('AVAILABLE', 2);
    INSERT INTO RestaurantTables (status, capacity) VALUES ('AVAILABLE', 4);
    INSERT INTO RestaurantTables (status, capacity) VALUES ('AVAILABLE', 4);
    INSERT INTO RestaurantTables (status, capacity) VALUES ('AVAILABLE', 6);
    INSERT INTO RestaurantTables (status, capacity) VALUES ('AVAILABLE', 8);
END

-- 6. Seed Staff (MANAGER) — password = "password123" BCrypt hashed
-- BCrypt hash of "password123" with cost 10:
-- $2a$10$xJwL5v5zI.G3oDH7bL3lMu7AhKJ/m1/mJxe7JYMYZ9Ml3KeRtCcna
IF NOT EXISTS (SELECT 1 FROM Staff WHERE email = 'manager@test.com')
    INSERT INTO Staff (full_name, email, phone, password, role, is_active, created_at)
    VALUES ('Test Manager', 'manager@test.com', '0901000001',
            '$2a$10$xJwL5v5zI.G3oDH7bL3lMu7AhKJ/m1/mJxe7JYMYZ9Ml3KeRtCcna',
            'MANAGER', 1, GETUTCDATE());

IF NOT EXISTS (SELECT 1 FROM Staff WHERE email = 'admin@test.com')
    INSERT INTO Staff (full_name, email, phone, password, role, is_active, created_at)
    VALUES ('Test Admin', 'admin@test.com', '0901000002',
            '$2a$10$xJwL5v5zI.G3oDH7bL3lMu7AhKJ/m1/mJxe7JYMYZ9Ml3KeRtCcna',
            'ADMIN', 1, GETUTCDATE());

-- 7. Seed Customer — phone = "0901234567", password = "password123"
IF NOT EXISTS (SELECT 1 FROM Customers WHERE phone = '0901234567')
    INSERT INTO Customers (full_name, phone, email, password, address, gender,
                           membership_level, loyalty_points, created_at)
    VALUES ('Test Customer', '0901234567', 'customer@test.com',
            '$2a$10$xJwL5v5zI.G3oDH7bL3lMu7AhKJ/m1/mJxe7JYMYZ9Ml3KeRtCcna',
            '123 Test St', 'MALE', 'NORMAL', 0, GETUTCDATE());

-- 8. Seed a Discount Code
IF NOT EXISTS (SELECT 1 FROM DiscountCodes WHERE code = 'PROMO10')
    INSERT INTO DiscountCodes (code, discount_type, discount_value, min_order_amount,
                               max_discount_amount, valid_from, valid_to,
                               usage_limit, used_count, is_active)
    VALUES ('PROMO10', 'PERCENT', 10, 50000, 20000,
            GETUTCDATE(), DATEADD(YEAR, 1, GETUTCDATE()), 100, 0, 1);

PRINT 'Seed data inserted successfully.';