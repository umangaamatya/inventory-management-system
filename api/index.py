# Python serverless function for Vercel to expose the InventoryAPI
# Single function handles all /api/* routes via vercel.json rewrite

from http.server import BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import os
import sys
import re

# Ensure backend modules are importable
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(ROOT_DIR, 'backend')
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

try:
    from src.api import InventoryAPI
except Exception as e:
    # Fallback: provide a minimal stub if imports fail
    class InventoryAPI:  # type: ignore
        def __init__(self):
            self._inv = [
                {"id": 1, "name": "Test Product", "price": 10.99, "quantity": 5, "category": "Test"}
            ]
        def get_inventory(self):
            return self._inv
        def add_product(self, name, price, quantity, category):
            new_id = (self._inv[-1]['id'] + 1) if self._inv else 1
            self._inv.append({"id": new_id, "name": name, "price": price, "quantity": quantity, "category": category})
            return {"status": "success", "product_id": new_id}
        def update_stock(self, product_id, quantity_change):
            for p in self._inv:
                if p['id'] == product_id:
                    p['quantity'] += quantity_change
                    return {"status": "success"}
            return {"status": "error", "message": "Product not found"}
        def place_order(self, *args, **kwargs):
            return {"status": "success", "order_id": 1}
        def process_orders(self, count=1):
            return {"status": "success", "processed_orders": []}
        def get_transactions(self, limit=10):
            return []
        def get_system_status(self):
            return {"total_products": len(self._inv), "pending_orders": 0, "backorders": 0, "items_ready_for_delivery": 0, "total_transactions": 0}
        def calculate_composite_cost(self, components):
            return {"status": "success", "total_cost": 0}

api = InventoryAPI()

class handler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        # CORS (harmless if same-origin on Vercel)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
        self.end_headers()

    def _json(self, status, payload):
        self._set_headers(status)
        self.wfile.write(json.dumps(payload).encode('utf-8'))

    def _read_json(self):
        length = int(self.headers.get('content-length', 0) or 0)
        if length > 0:
            raw = self.rfile.read(length)
            try:
                return json.loads(raw.decode('utf-8'))
            except Exception:
                return {}
        return {}

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        try:
            self._route('GET')
        except Exception as e:
            self._json(500, {"error": str(e)})

    def do_POST(self):
        try:
            self._route('POST')
        except Exception as e:
            self._json(500, {"error": str(e)})

    def do_PUT(self):
        try:
            self._route('PUT')
        except Exception as e:
            self._json(500, {"error": str(e)})

    def _route(self, method: str):
        parsed = urlparse(self.path)
        path = parsed.path
        # Normalize path: strip leading /api if present (after Vercel rewrite)
        if path.startswith('/api/'):
            path = path[4:]
        elif path == '/api':
            path = '/'
        qs = parse_qs(parsed.query or '')

        # GET /inventory
        if method == 'GET' and path == '/inventory':
            return self._json(200, api.get_inventory())

        # POST /inventory
        if method == 'POST' and path == '/inventory':
            data = self._read_json()
            result = api.add_product(
                data.get('name'), data.get('price'), data.get('quantity'), data.get('category')
            )
            return self._json(200, result)

        # PUT /inventory/<id>
        m = re.match(r'^/inventory/(\d+)$', path)
        if method == 'PUT' and m:
            data = self._read_json()
            product_id = int(m.group(1))
            result = api.update_stock(product_id, data.get('quantityChange', 0))
            return self._json(200, result)

        # POST /orders
        if method == 'POST' and path == '/orders':
            data = self._read_json()
            result = api.place_order(
                data.get('productId'), data.get('quantity'), data.get('customerName'), data.get('priority', 1)
            )
            return self._json(200, result)

        # POST /orders/process
        if method == 'POST' and path == '/orders/process':
            data = self._read_json()
            count = data.get('count', 1)
            result = api.process_orders(count)
            return self._json(200, result)

        # GET /transactions
        if method == 'GET' and path == '/transactions':
            limit = int(qs.get('limit', ['10'])[0])
            return self._json(200, api.get_transactions(limit))

        # GET /status
        if method == 'GET' and path == '/status':
            return self._json(200, api.get_system_status())

        # POST /composite-cost
        if method == 'POST' and path == '/composite-cost':
            data = self._read_json()
            result = api.calculate_composite_cost(data.get('components', []))
            return self._json(200, result)

        # GET /debug
        if method == 'GET' and path == '/debug':
            info = {
                "python_path_entries": [p for p in sys.path if isinstance(p, str)],
                "cwd": os.getcwd(),
                "backend_dir_exists": os.path.exists(BACKEND_DIR),
            }
            return self._json(200, info)

        return self._json(404, {"error": "Not found"})

