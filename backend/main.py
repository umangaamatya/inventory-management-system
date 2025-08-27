#!/usr/bin/env python3
"""
Main entry point for the Inventory Management System with Flask API
"""

from flask import Flask, jsonify, request, send_from_directory
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Initialize Flask app
app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')

# Initialize the API
try:
    from src.api import InventoryAPI
    api = InventoryAPI()
    print("✓ API initialized successfully")
except ImportError as e:
    print(f"✗ Error importing API: {e}")
    # Create a mock API for testing
    class MockAPI:
        def get_inventory(self):
            return [{"id": 1, "name": "Test Product", "price": 10.99, "quantity": 5, "category": "Test"}]
        def get_system_status(self):
            return {"total_products": 1, "pending_orders": 0, "backorders": 0, "items_ready_for_delivery": 0}
    api = MockAPI()

# Simple CORS handling - Add headers to all responses
@app.after_request
def add_cors_headers(response):
    # Set only one Access-Control-Allow-Origin header
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
    return response

# Handle preflight OPTIONS requests
@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
        return response

# Serve React App
@app.route('/')
def serve_react_app():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static_files(path):
    return send_from_directory(app.static_folder, path)

# API Routes
@app.route('/api/inventory', methods=['GET'])
def get_inventory():
    try:
        inventory_data = api.get_inventory()
        print(f"Returning inventory data: {len(inventory_data)} items")
        return jsonify(inventory_data)
    except Exception as e:
        print(f"Error in get_inventory: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/inventory', methods=['POST'])
def add_product():
    try:
        data = request.get_json()
        print(f"Adding product: {data}")
        result = api.add_product(
            data['name'],
            data['price'],
            data['quantity'],
            data['category']
        )
        return jsonify(result)
    except Exception as e:
        print(f"Error in add_product: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/inventory/<int:product_id>', methods=['PUT'])
def update_stock(product_id):
    try:
        data = request.get_json()
        result = api.update_stock(product_id, data['quantityChange'])
        return jsonify(result)
    except Exception as e:
        print(f"Error in update_stock: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders', methods=['POST'])
def place_order():
    try:
        data = request.get_json()
        result = api.place_order(
            data['productId'],
            data['quantity'],
            data['customerName'],
            data.get('priority', 1)
        )
        return jsonify(result)
    except Exception as e:
        print(f"Error in place_order: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/orders/process', methods=['POST'])
def process_orders():
    try:
        data = request.get_json()
        count = data.get('count', 1)
        result = api.process_orders(count)
        return jsonify(result)
    except Exception as e:
        print(f"Error in process_orders: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    try:
        limit = request.args.get('limit', 10, type=int)
        return jsonify(api.get_transactions(limit))
    except Exception as e:
        print(f"Error in get_transactions: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/status', methods=['GET'])
def get_status():
    try:
        return jsonify(api.get_system_status())
    except Exception as e:
        print(f"Error in get_status: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/composite-cost', methods=['POST'])
def calculate_composite_cost():
    try:
        data = request.get_json()
        result = api.calculate_composite_cost(data['components'])
        return jsonify(result)
    except Exception as e:
        print(f"Error in calculate_composite_cost: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/debug', methods=['GET'])
def debug_info():
    """Debug endpoint to check what's working"""
    debug_info = {
        "flask_working": True,
        "api_initialized": hasattr(api, 'get_inventory'),
        "inventory_count": len(api.get_inventory()) if hasattr(api, 'get_inventory') else 0,
        "python_path": os.environ.get('PYTHONPATH', 'Not set'),
        "current_directory": os.getcwd(),
        "files_in_src": os.listdir('src') if os.path.exists('src') else 'src directory not found'
    }
    return jsonify(debug_info)

if __name__ == "__main__":
    # Create frontend build directory if it doesn't exist
    if not os.path.exists(app.static_folder):
        os.makedirs(app.static_folder)
        with open(os.path.join(app.static_folder, 'index.html'), 'w') as f:
            f.write('<html><body><h1>React app will be built here</h1></body></html>')
    
    print("Starting Inventory Management System API...")
    print(f"Current directory: {os.getcwd()}")
    
    app.run(debug=True, port=5001, host='0.0.0.0')
    