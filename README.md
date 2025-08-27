# DSA Inventory Management System

A Python project demonstrating Data Structures and Algorithms concepts through a simple inventory management system.

## Project Structure
inventory_management_system/
├── main.py # Entry point
├── requirements.txt # Dependencies
├── README.md # Documentation
│
├── src/ # Source code
│ ├── inventory_manager.py # Week 1: Lists & Matrices
│ ├── composite_product.py # Week 2: Recursion
│ ├── user_interface.py # Week 3: Functions & Loops
│ ├── transaction_ledger.py # Week 4: Linked Lists
│ ├── order_management.py # Week 5: Stacks & Queues
│ └── api.py # API for React frontend
│
├── data/ # Runtime data
│ └── sample_data.py # Sample data
│
└── tests/ # Test files (to be implemented)



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