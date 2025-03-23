from flask import Blueprint, request, jsonify
from services.paypal_client import paypalrestsdk
from flask_cors import cross_origin

payment_bp = Blueprint('payment', __name__)

@payment_bp.route('/create-payment', methods=['POST'])
@cross_origin()
def create_payment():
    """Create a PayPal payment"""
    try:
        data = request.get_json()
        if not data or 'amount' not in data:
            return jsonify({"error": "Missing amount in request"}), 400

        amount = data['amount']
        currency = data.get('currency', 'USD')

        # Create PayPal payment
        payment = paypalrestsdk.Payment({
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3002/payment",
                "cancel_url": "http://localhost:3002/payment"
            },
            "transactions": [{
                "amount": {
                    "total": str(amount),
                    "currency": currency
                },
                "description": "TradeWise Premium Subscription"
            }]
        })

        if payment.create():
            # Get approval URL
            approval_url = next(link.href for link in payment.links if link.rel == 'approval_url')
            return jsonify({
                "status": "success",
                "payment_id": payment.id,
                "approval_url": approval_url
            })
        else:
            # Get detailed error message
            error_details = payment.error.get('details', [{}])[0].get('issue', 'Unknown error')
            print(f"PayPal payment creation failed: {error_details}")
            return jsonify({"error": f"Payment creation failed: {error_details}"}), 400

    except paypalrestsdk.exceptions.UnauthorizedAccess:
        print("PayPal authorization error: Invalid credentials")
        return jsonify({"error": "PayPal authorization failed. Please check API credentials."}), 401
    except paypalrestsdk.exceptions.ConnectionError as e:
        print(f"PayPal connection error: {str(e)}")
        return jsonify({"error": "Could not connect to PayPal. Please try again later."}), 503
    except Exception as e:
        print(f"Error creating payment: {str(e)}")
        return jsonify({"error": str(e)}), 500

@payment_bp.route('/execute-payment', methods=['POST'])
@cross_origin()
def execute_payment():
    """Execute a PayPal payment"""
    try:
        data = request.get_json()
        if not data or 'payment_id' not in data or 'payer_id' not in data:
            return jsonify({"error": "Missing payment_id or payer_id"}), 400

        payment = paypalrestsdk.Payment.find(data['payment_id'])
        
        if payment.execute({"payer_id": data['payer_id']}):
            return jsonify({
                "status": "success",
                "payment_id": payment.id
            })
        else:
            error_details = payment.error.get('details', [{}])[0].get('issue', 'Unknown error')
            print(f"PayPal payment execution failed: {error_details}")
            return jsonify({"error": f"Payment execution failed: {error_details}"}), 400

    except paypalrestsdk.exceptions.UnauthorizedAccess:
        print("PayPal authorization error: Invalid credentials")
        return jsonify({"error": "PayPal authorization failed. Please check API credentials."}), 401
    except paypalrestsdk.exceptions.ResourceNotFound:
        return jsonify({"error": "Payment not found. Invalid payment_id."}), 404
    except Exception as e:
        print(f"Error executing payment: {str(e)}")
        return jsonify({"error": str(e)}), 500