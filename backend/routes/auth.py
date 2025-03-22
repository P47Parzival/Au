from flask import Blueprint, request, jsonify, current_app
from services.angel_one import angel_one_service
from flask_cors import cross_origin
import jwt
import os
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
@cross_origin()
def login():
    """Login with Angel One credentials"""
    try:
        print("Starting login process...")
        data = request.get_json()
        print("Received login request data:", data)
        
        if not data:
            print("No JSON data received")
            return jsonify({"error": "No data received"}), 400

        client_id = data.get('client_id')
        password = data.get('password')
        totp = data.get('totp')

        print(f"Processing login for client_id: {client_id}")
        print(f"Password length: {len(password) if password else 0}")
        print(f"TOTP length: {len(totp) if totp else 0}")

        if not all([client_id, password, totp]):
            print("Missing credentials")
            return jsonify({"error": "Missing credentials"}), 400

        # Set credentials in service
        try:
            print("Setting credentials in Angel One service...")
            angel_one_service.set_credentials(client_id, password, totp)
            print("Credentials set successfully")
        except Exception as e:
            print(f"Error setting credentials: {str(e)}")
            import traceback
            print("Traceback:", traceback.format_exc())
            return jsonify({
                "status": "error",
                "message": f"Error setting credentials: {str(e)}"
            }), 500

        # Try to connect
        try:
            print("Attempting to connect to Angel One...")
            if angel_one_service.connect():
                print("Successfully connected to Angel One")
                # Get user profile
                print("Fetching user profile...")
                profile = angel_one_service.get_profile()
                print("Connection successful, profile:", profile)
                
                # Create session token
                token_payload = {
                    'client_id': client_id,
                    'exp': datetime.utcnow() + timedelta(days=1)
                }
                print("Creating token with payload:", token_payload)
                
                session_token = jwt.encode(
                    token_payload,
                    current_app.config['SECRET_KEY'],
                    algorithm='HS256'
                )
                print("Generated token:", session_token)

                return jsonify({
                    "status": "success",
                    "message": "Login successful",
                    "token": session_token,
                    "profile": profile
                })
            else:
                print("Failed to connect to Angel One")
                return jsonify({
                    "status": "error",
                    "message": "Failed to connect to Angel One"
                }), 401
        except Exception as e:
            print(f"Error during connection: {str(e)}")
            import traceback
            print("Connection error traceback:", traceback.format_exc())
            return jsonify({
                "status": "error",
                "message": f"Connection error: {str(e)}"
            }), 500
        
    except Exception as e:
        print("Login error:", str(e))
        import traceback
        print("Full traceback:", traceback.format_exc())
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@auth_bp.route('/verify', methods=['GET'])
@cross_origin()
def verify_token():
    """Verify JWT token"""
    try:
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "No token provided"}), 401

        token = token.split(' ')[1]  # Remove 'Bearer ' prefix
        
        # Verify token
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        
        return jsonify({
            "status": "success",
            "message": "Token is valid",
            "client_id": payload['client_id']
        })

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401 