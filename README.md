# Project 1 Day

This project consists of a Vue.js frontend and a .NET Core Web API backend.

## Project Structure

- `frontend/`: Vue.js application (Vite)
- `backend/`: .NET Core Web API

## Getting Started

### Backend
1. `cd backend`
2. `dotnet run`

### Frontend
1. `cd frontend`
2. `npm install` (already done)
3. `npm run dev`

## Configuration
The backend is configured to use Entity Framework Core with SQL Server.
The frontend is a default Vite + Vue starter.

## Database Schema

Below is the Entity-Relationship diagram for the Restaurant Management System:

```mermaid
erDiagram
    Category ||--o{ FB : contains
    Manufacturer ||--o{ FB : produces
    Manufacturer ||--o{ Receipt : supplies
    FB ||--|| Warehouse : stock_in
    Customer ||--o{ TableReservation : makes
    RestaurantTable ||--o{ TableReservation : reserved_for
    TableReservation ||--o| RestaurantOrder : initiates
    RestaurantTable ||--o{ RestaurantOrder : hosts
    RestaurantOrder ||--o{ OrderItem : includes
    FB ||--o{ OrderItem : ordered_as
    DiscountCode ||--o{ Invoice : applied_to
    RestaurantOrder ||--|| Invoice : billed_as
    Staff ||--o{ Invoice : processes
    Invoice ||--o| Review : receives
    Customer ||--o{ Review : writes
    Review ||--o{ ReviewReply : has
    Staff ||--o{ ReviewReply : replies
    Staff ||--o{ Receipt : creates
    Receipt ||--o{ ReceiptDetail : contains
    FB ||--o{ ReceiptDetail : received_item

    Category {
        int category_id PK
        string name
        string type
        decimal min_price
        decimal max_price
    }
    Manufacturer {
        int manufacturer_id PK
        string name
        string address
        string phone
        bool is_inhouse
    }
    FB {
        int item_id PK
        int category_id FK
        int manufacturer_id FK
        string name
        string unit
        decimal price
        string item_type
        string stock_status
        bool show_on_menu
    }
    Warehouse {
        int item_id PK "FK to FB"
        int current_stock
        datetime last_updated
    }
    Customer {
        string id_number PK
        string full_name
        string address
        string gender
        string membership_level
        int loyalty_points
    }
    Staff {
        long staff_id PK
        string full_name
        string email
        string phone
        string role
        string department
        date hire_date
        bool is_active
    }
    RestaurantTable {
        int table_id PK
        string table_number
        int capacity
        string location
        string status
    }
    TableReservation {
        long reservation_id PK
        string customer_id FK
        int table_id FK
        datetime reserved_at
        int guest_count
        string status
        string notes
    }
    RestaurantOrder {
        long order_id PK
        long reservation_id FK
        int table_id FK
        string status
        string notes
    }
    OrderItem {
        long order_item_id PK
        long order_id FK
        int item_id FK
        int quantity
        decimal unit_price
        decimal subtotal "Computed"
        string notes
    }
    DiscountCode {
        int discount_code_id PK
        string code
        string discount_type
        decimal discount_value
        decimal min_order_amount
        decimal max_discount_amount
        date valid_from
        date valid_to
        int usage_limit
        int used_count
        bool is_active
    }
    Invoice {
        long invoice_id PK
        string invoice_code
        long order_id FK
        long processed_by FK
        int discount_code_id FK
        decimal subtotal
        decimal discount_amount
        decimal total_amount
        string payment_method
        string status
    }
    Review {
        long review_id PK
        long invoice_id FK
        string customer_id FK
        int rating
        string content
    }
    ReviewReply {
        long reply_id PK
        long review_id FK
        long staff_id FK
        string content
    }
    Receipt {
        long receipt_id PK
        int manufacturer_id FK
        date receipt_date
        decimal total_amount
        string notes
        long created_by FK
    }
    ReceiptDetail {
        long receipt_detail_id PK
        long receipt_id FK
        int item_id FK
        int quantity
        decimal import_price
        decimal subtotal "Computed"
    }
```
