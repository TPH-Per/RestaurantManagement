const fs = require('fs');
const path = require('path');

const dir = 'RestaurantMS/src/RestaurantMS.API/Scripts';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const scripts = {
    '01_Categories.sql': `CREATE TABLE Categories ( category_id BIGINT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(100) NOT NULL, type NVARCHAR(10) NOT NULL );`,
    '02_Manufacturers.sql': `CREATE TABLE Manufacturers ( manufacturer_id BIGINT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(100) NOT NULL, address NVARCHAR(255), phone NVARCHAR(20) );`,
    '03_Staff.sql': `CREATE TABLE Staff ( staff_id BIGINT IDENTITY(1,1) PRIMARY KEY, full_name NVARCHAR(100) NOT NULL, email NVARCHAR(100) NOT NULL, phone NVARCHAR(20), password NVARCHAR(100) NOT NULL, role NVARCHAR(20) NOT NULL, is_active BIT NOT NULL, created_at DATETIME2 NOT NULL );`,
    '04_Customers.sql': `CREATE TABLE Customers ( customer_id BIGINT IDENTITY(1,1) PRIMARY KEY, phone NVARCHAR(20) NOT NULL, full_name NVARCHAR(100) NOT NULL, email NVARCHAR(100), password NVARCHAR(100) NOT NULL, address NVARCHAR(255), gender NVARCHAR(10), membership_level NVARCHAR(20) NOT NULL, loyalty_points INT NOT NULL, created_at DATETIME2 NOT NULL );`,
    '05_DiscountCodes.sql': `CREATE TABLE DiscountCodes ( discount_code_id BIGINT IDENTITY(1,1) PRIMARY KEY, code NVARCHAR(50) NOT NULL, discount_type NVARCHAR(10) NOT NULL, discount_value DECIMAL(18,2) NOT NULL, min_order_amount DECIMAL(18,2), max_discount_amount DECIMAL(18,2), valid_from DATETIME2 NOT NULL, valid_to DATETIME2 NOT NULL, usage_limit INT, used_count INT NOT NULL, is_active BIT NOT NULL );`,
    '06_RestaurantTables.sql': `CREATE TABLE RestaurantTables ( table_id BIGINT IDENTITY(1,1) PRIMARY KEY, status NVARCHAR(20) NOT NULL, capacity INT NOT NULL );`,
    '07_FBs.sql': `CREATE TABLE FBs ( fb_id BIGINT IDENTITY(1,1) PRIMARY KEY, name NVARCHAR(100) NOT NULL, price DECIMAL(18,2) NOT NULL, type NVARCHAR(20) NOT NULL, category_id BIGINT NOT NULL, manufacturer_id BIGINT, is_visible BIT NOT NULL, unit NVARCHAR(50), description NVARCHAR(500) );`,
    '08_Warehouses.sql': `CREATE TABLE Warehouses ( warehouse_id BIGINT IDENTITY(1,1) PRIMARY KEY, fb_id BIGINT NOT NULL, quantity INT NOT NULL, low_stock_threshold INT NOT NULL );`,
    '09_Receipts.sql': `CREATE TABLE Receipts ( receipt_id BIGINT IDENTITY(1,1) PRIMARY KEY, manufacturer_id BIGINT NOT NULL, staff_id BIGINT NOT NULL, imported_at DATETIME2 NOT NULL );`,
    '10_ReceiptDetails.sql': `CREATE TABLE ReceiptDetails ( receipt_detail_id BIGINT IDENTITY(1,1) PRIMARY KEY, receipt_id BIGINT NOT NULL, item_id BIGINT NOT NULL, quantity INT NOT NULL, import_price DECIMAL(18,2) NOT NULL );`,
    '11_TableReservations.sql': `CREATE TABLE TableReservations ( reservation_id BIGINT IDENTITY(1,1) PRIMARY KEY, customer_id BIGINT NOT NULL, table_id BIGINT NOT NULL, reserved_at DATETIME2 NOT NULL, guest_count INT NOT NULL, notes NVARCHAR(500), status NVARCHAR(20) NOT NULL );`,
    '12_RestaurantOrders.sql': `CREATE TABLE RestaurantOrders ( order_id BIGINT IDENTITY(1,1) PRIMARY KEY, table_id BIGINT NOT NULL, reservation_id BIGINT, customer_id BIGINT, status NVARCHAR(20) NOT NULL, created_at DATETIME2 NOT NULL );`,
    '13_OrderItems.sql': `CREATE TABLE OrderItems ( order_item_id BIGINT IDENTITY(1,1) PRIMARY KEY, order_id BIGINT NOT NULL, item_id BIGINT NOT NULL, quantity INT NOT NULL, unit_price DECIMAL(18,2) NOT NULL );`,
    '14_Invoices.sql': `CREATE TABLE Invoices ( invoice_id BIGINT IDENTITY(1,1) PRIMARY KEY, order_id BIGINT NOT NULL, subtotal DECIMAL(18,2) NOT NULL, discount_amount DECIMAL(18,2) NOT NULL, total DECIMAL(18,2) NOT NULL, status NVARCHAR(20) NOT NULL, payment_method NVARCHAR(20), discount_code_id BIGINT, cashier_id BIGINT, paid_at DATETIME2 );`,
    '15_Reviews.sql': `CREATE TABLE Reviews ( review_id BIGINT IDENTITY(1,1) PRIMARY KEY, invoice_id BIGINT NOT NULL, customer_id BIGINT NOT NULL, stars INT NOT NULL, content NVARCHAR(1000) NOT NULL, created_at DATETIME2 NOT NULL );`,
    '16_ReviewReplies.sql': `CREATE TABLE ReviewReplies ( reply_id BIGINT IDENTITY(1,1) PRIMARY KEY, review_id BIGINT NOT NULL, staff_id BIGINT NOT NULL, content NVARCHAR(1000) NOT NULL, created_at DATETIME2 NOT NULL );`
};

for (const [file, sql] of Object.entries(scripts)) {
    fs.writeFileSync(path.join(dir, file), sql);
}
console.log('Created 16 SQL scripts.');
