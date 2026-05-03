-- 17_PerformanceIndexes.sql
CREATE INDEX IX_FBs_CategoryId ON FBs(category_id);
CREATE INDEX IX_FBs_Type_IsVisible ON FBs(type, is_visible);
CREATE INDEX IX_FBs_Name ON FBs(name);
CREATE UNIQUE INDEX IX_Customers_Phone ON Customers(phone);
CREATE INDEX IX_Customers_Email ON Customers(email);
CREATE UNIQUE INDEX IX_Staff_Email ON Staff(email);
CREATE UNIQUE INDEX IX_DiscountCodes_Code ON DiscountCodes(code) WHERE is_active = 1;
CREATE INDEX IX_OrderItems_OrderId ON OrderItems(order_id);
CREATE INDEX IX_TableReservations_CustomerId_ReservedAt ON TableReservations(customer_id, reserved_at);
CREATE INDEX IX_RestaurantOrders_TableId_Status ON RestaurantOrders(table_id, status);
