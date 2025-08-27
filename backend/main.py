#!/usr/bin/env python3
"""
Main entry point for the Inventory Management System with Flask API
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

from src.api import InventoryAPI

# Initialize Flask app
app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)  # Enable CORS for all routes

# Initialize the API
api = InventoryAPI()

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
    return jsonify(api.get_inventory())

@app.route('/api/inventory', methods=['POST'])
def add_product():
    data = request.get_json()
    result = api.add_product(
        data['name'],
        data['price'],
        data['quantity'],
        data['category']
    )
    return jsonify(result)

@app.route('/api/inventory/<int:product_id>', methods=['PUT'])
def update_stock(product_id):
    data = request.get_json()
    result = api.update_stock(product_id, data['quantityChange'])
    return jsonify(result)

@app.route('/api/orders', methods=['POST'])
def place_order():
    data = request.get_json()
    result = api.place_order(
        data['productId'],
        data['quantity'],
        data['customerName'],
        data.get('priority', 1)
    )
    return jsonify(result)

@app.route('/api/orders/process', methods=['POST'])
def process_orders():
    data = request.get_json()
    count = data.get('count', 1)
    result = api.process_orders(count)
    return jsonify(result)

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    limit = request.args.get('limit', 10, type=int)
    return jsonify(api.get_transactions(limit))

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify(api.get_system_status())

@app.route('/api/composite-cost', methods=['POST'])
def calculate_composite_cost():
    data = request.get_json()
    result = api.calculate_composite_cost(data['components'])
    return jsonify(result)

if __name__ == "__main__":
    # Create frontend build directory if it doesn't exist
    if not os.path.exists(app.static_folder):
        os.makedirs(app.static_folder)
        with open(os.path.join(app.static_folder, 'index.html'), 'w') as f:
            f.write('<html><body><h1>React app will be built here</h1></body></html>')
    
    print("Starting Inventory Management System API...")
    app.run(debug=True, port=5000)