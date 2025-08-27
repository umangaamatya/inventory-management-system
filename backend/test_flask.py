#!/usr/bin/env python3
"""
Test script to verify Flask installation
"""

try:
    from flask import Flask
    from flask_cors import CORS
    print("✓ Flask and Flask-CORS imported successfully!")
    
    # Test creating a Flask app
    app = Flask(__name__)
    CORS(app)
    print("✓ Flask app created successfully!")
    
except ImportError as e:
    print(f"✗ Import error: {e}")
    print("Please check your virtual environment and installations.")
    
except Exception as e:
    print(f"✗ Other error: {e}")