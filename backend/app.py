from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv
import os
import paypalrestsdk
import logging

# Import routes
from routes.stocks import stocks_bp
from routes.auth import auth_bp

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Set secret key with a default value if not in environment
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-super-secret-key-12345')

# Log PayPal configuration
logger.info("PayPal Mode: %s", os.getenv('PAYPAL_MODE', 'sandbox'))
logger.info("PayPal Client ID length: %d", len(os.getenv('PAYPAL_CLIENT_ID', '')))
logger.info("PayPal Client Secret length: %d", len(os.getenv('PAYPAL_CLIENT_SECRET', '')))

# Configure PayPal
try:
    paypalrestsdk.configure({
        "mode": os.getenv('PAYPAL_MODE', 'sandbox'),
        "client_id": os.getenv('PAYPAL_CLIENT_ID'),
        "client_secret": os.getenv('PAYPAL_CLIENT_SECRET')
    })
    logger.info("PayPal SDK configured successfully")
except Exception as e:
    logger.error("Failed to configure PayPal SDK: %s", str(e))

# Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(stocks_bp, url_prefix='/api/stocks')

# Basic route for testing
@app.route('/api/health')
def health_check():
    return {"status": "healthy", "message": "Backend is running"}

# PayPal payment routes
@app.route('/api/create-payment', methods=['POST'])
def create_payment():
    try:
        data = request.get_json()
        amount = float(data.get('amount', 0))
        currency = data.get('currency', 'USD')

        logger.info("Creating payment with amount: %s %s", amount, currency)
        logger.debug("PayPal SDK Configuration: mode=%s, client_id_length=%d", 
                    os.getenv('PAYPAL_MODE'), len(os.getenv('PAYPAL_CLIENT_ID', '')))

        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "transactions": [{
                "amount": {
                    "total": str(amount),
                    "currency": currency
                },
                "description": "Payment for Au Trading Platform"
            }],
            "redirect_urls": {
                "return_url": "http://localhost:3000/payment",
                "cancel_url": "http://localhost:3000/payment"
            }
        })

        if payment.create():
            approval_url = next(link['href'] for link in payment.links if link['rel'] == 'approval_url')
            logger.info("Payment created successfully. ID: %s", payment.id)
            return jsonify({
                "success": True,
                "payment_id": payment.id,
                "approval_url": approval_url
            })
        else:
            logger.error("Payment creation failed. Error: %s", payment.error)
            return jsonify({"error": payment.error}), 400

    except Exception as e:
        logger.error("Error creating payment: %s", str(e), exc_info=True)
        return jsonify({"error": str(e)}), 400

@app.route('/api/execute-payment', methods=['POST'])
def execute_payment():
    try:
        data = request.get_json()
        payment_id = data.get('payment_id')
        payer_id = data.get('payer_id')

        logger.info("Executing payment: payment_id=%s, payer_id=%s", payment_id, payer_id)

        if not payment_id or not payer_id:
            return jsonify({"error": "payment_id and payer_id are required"}), 400

        payment = paypalrestsdk.Payment.find(payment_id)

        if payment.execute({"payer_id": payer_id}):
            logger.info("Payment executed successfully. ID: %s", payment.id)
            return jsonify({
                "status": "success",
                "payment_id": payment.id
            })
        else:
            logger.error("Payment execution failed. Error: %s", payment.error)
            return jsonify({"error": payment.error}), 400

    except Exception as e:
        logger.error("Error executing payment: %s", str(e), exc_info=True)
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    # Log the environment configuration
    logger.info("Starting server with PayPal configuration:")
    logger.info("Mode: %s", os.getenv('PAYPAL_MODE'))
    logger.info("Client ID exists: %s", bool(os.getenv('PAYPAL_CLIENT_ID')))
    logger.info("Client Secret exists: %s", bool(os.getenv('PAYPAL_CLIENT_SECRET')))
    
    socketio.run(app, debug=True, port=5000) 