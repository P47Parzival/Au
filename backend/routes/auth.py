from flask import Blueprint, request, jsonify
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
        data = request.get_json()
        client_id = data.get('client_id')
        password = data.get('password')
        totp = data.get('totp')

        if not all([client_id, password, totp]):
            return jsonify({"error": "Missing credentials"}), 400

        # Set credentials in service
        angel_one_service.client_id = client_id
        angel_one_service.password = password
        angel_one_service.totp_key = totp

        # Try to connect
        if angel_one_service.connect():
            # Get user profile
            profile = angel_one_service.get_profile()
            
            # Create session token
            session_token = jwt.encode(
                {
                    'client_id': client_id,
                    'exp': datetime.utcnow() + timedelta(days=1)
                },
                os.getenv('SECRET_KEY'),
                algorithm='HS256'
            )

            return jsonify({
                "status": "success",
                "message": "Login successful",
                "token": session_token,
                "profile": profile
            })
        
        return jsonify({
            "status": "error",
            "message": "Invalid credentials"
        }), 401

    except Exception as e:
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
        payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        
        return jsonify({
            "status": "success",
            "message": "Token is valid",
            "client_id": payload['client_id']
        })

    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401 