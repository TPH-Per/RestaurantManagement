# Restaurant Management System API Design

## Overview
Base URL: `http://localhost:5000/api/v1`
Format: JSON

## Endpoints

### 1. Categories (`/categories`)
- `GET /`: Get all categories
- `GET /:id`: Get category detail
- `POST /`: Create category
- `PUT /:id`: Update category
- `DELETE /:id`: Delete category

### 2. Manufacturers (`/manufacturers`)
- `GET /`: Get all manufacturers
- `POST /`: Create manufacturer
- `PUT /:id`: Update manufacturer
- `DELETE /:id`: Delete manufacturer

### 3. Food & Beverages (`/fb`)
- `GET /`: Get all FB items
- `GET /menu`: Get items showing on menu (View `v_Menu`)
- `POST /`: Create FB item
- `PUT /:id`: Update FB item
- `DELETE /:id`: Delete FB item

### 4. Customers (`/customers`)
- `GET /`: List customers
- `GET /:id_number`: Get customer by ID number
- `POST /`: Register customer
- `PUT /:id_number`: Update customer

### 5. Staff (`/staff`)
- `GET /`: List staff
- `POST /`: Create staff
- `PUT /:id`: Update staff
- `PATCH /:id/status`: Activate/Deactivate staff

### 6. Tables (`/tables`)
- `GET /`: List all tables
- `PATCH /:id/status`: Update table status (AVAILABLE, OCCUPIED, etc.)

### 7. Reservations (`/reservations`)
- `GET /`: List reservations
- `POST /`: Create reservation
- `PATCH /:id/status`: Update status (CONFIRMED, CANCELLED, etc.)

### 8. Orders (`/orders`)
- `GET /`: List orders
- `GET /:id`: Get order detail (with items)
- `POST /`: Create order
- `PATCH /:id/status`: Update order status

### 9. Order Items (`/order-items`)
- `POST /`: Add item to order
- `PUT /:id`: Update quantity/notes
- `DELETE /:id`: Remove item from order

### 10. Discount Codes (`/discount-codes`)
- `GET /`: List codes
- `GET /validate/:code`: Validate a code for an order amount
- `POST /`: Create code

### 11. Invoices (`/invoices`)
- `GET /`: List invoices
- `GET /:id`: Get invoice detail
- `POST /`: Create invoice for an order
- `POST /:id/apply-discount`: Apply discount code to invoice
- `POST /:id/pay`: Process payment and change status to PAID

### 12. Reviews (`/reviews`)
- `GET /`: List reviews
- `POST /`: Create review (requires PAID invoice)

### 13. Review Replies (`/review-replies`)
- `POST /`: Staff reply to a review

### 14. Receipts (`/receipts`)
- `GET /`: List import receipts
- `POST /`: Create receipt (Inventory import)

### 15. Receipt Details (`/receipt-details`)
- `POST /`: Add item to receipt
- `DELETE /:id`: Remove item from receipt

### 16. Warehouse (`/warehouse`)
- `GET /`: Get inventory status (View `v_WarehouseStatus`)
- `PATCH /:id/stock`: Manual stock adjustment (INHOUSE only)

---

## Business Rules (Handled by Mock/Backend)
- **REGULAR**: Imported via Receipt only. Stock cannot be negative.
- **INHOUSE**: Manual stock adjustment allowed. No Receipts.
- **FRESH_RAW**: Hidden from menu. Imported via Receipt.
- **Invoice**: Subtotal and Total auto-calculated based on OrderItems and Discount.
