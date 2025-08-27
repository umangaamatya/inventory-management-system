# DSA Inventory Management System

A Python project demonstrating Data Structures and Algorithms concepts through a simple inventory management system.

## Project Structure
```
inventory-management-system/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── data/
│   │   ├── __init__.py
│   │   └── sample_data.py
│   ├── src/
│   │   ├── __init__.py
│   │   ├── api.py
│   │   ├── composite_product.py
│   │   ├── inventory_manager.py
│   │   ├── order_management.py
│   │   ├── transaction_ledger.py
│   │   └── user_interface.py
│   └── tests/
│       ├── __init__.py
│       ├── test_api.py
│       ├── test_composite.py
│       ├── test_inventory.py
│       ├── test_orders.py
│       └── test_transactions.py
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   ├── favicon.ico
│   │   └── index.html
│   └── src/
│       ├── App.css
│       ├── App.js
│       ├── index.js
│       ├── components/
│       │   ├── AddProduct.js
│       │   ├── Footer.js
│       │   ├── Header.js
│       │   ├── InventoryList.js
│       │   ├── OrderForm.js
│       │   └── TransactionHistory.js
│       └── services/
│           └── api.js
├── README.md
└── .gitignore
```

## How to Run

1. Clone or download the project
2. Navigate to the project directory
3. Run: `python main.py`

## Features

- **Week 1**: Inventory management using 2D lists and matrices
- **Week 2**: Composite product cost calculation using recursion
- **Week 3**: Menu-driven user interface with functions and loops
- **Week 4**: Transaction ledger using linked lists
- **Week 5**: Order management using stacks and queues

## API for React Frontend

The `api.py` module provides methods that can be exposed as endpoints for a React frontend:

- `get_inventory()` - Retrieve all products
- `add_product()` - Add a new product
- `update_stock()` - Update product quantity
- `place_order()` - Create a new order
- `process_orders()` - Process pending orders
- `get_transactions()` - Get transaction history
- `get_system_status()` - Get system metrics

## Data Storage

This implementation uses runtime data storage (in-memory) without a dedicated database. Data is lost when the application stops.