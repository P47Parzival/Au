import paypalrestsdk
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

client_id = os.getenv("PAYPAL_CLIENT_ID")
client_secret = os.getenv("PAYPAL_CLIENT_SECRET")
mode = os.getenv("PAYPAL_MODE", "sandbox")

# Verify credentials exist
if not client_id or not client_secret:
    raise ValueError("PayPal credentials not found in environment. Please check your .env file.")

print(f"PayPal Mode: {mode}")
print(f"PayPal Client ID: {client_id[:5]}...{client_id[-5:]}")
print(f"PayPal Client Secret: {client_secret[:5]}...{client_secret[-5:]}")

paypalrestsdk.configure({
    "mode": mode,  # Default to sandbox if not set
    "client_id": client_id,
    "client_secret": client_secret
})

# Test the credentials to catch configuration issues early
try:
    test_payment = paypalrestsdk.Payment.find("PAY-TEST")
except paypalrestsdk.ResourceNotFound:
    # This is expected - we're just testing authentication
    print("PayPal SDK configured successfully.")
except paypalrestsdk.UnauthorizedAccess:
    raise ValueError("PayPal credentials are invalid. Please check your CLIENT_ID and CLIENT_SECRET.")
except Exception as e:
    print(f"PayPal SDK connection warning: {str(e)}")