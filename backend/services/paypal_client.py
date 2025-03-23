# import paypalrestsdk

# paypalrestsdk.configure({
#     "mode": "sandbox",  # Change to "live" for production
#     "client_id": "AVjkFVgkSnZXx3oNOZgVNaT7ql6Cd7Rayexr6O15-eUQ_bXBt9GOMJt_OkmqEph7tKbmHaWZrASuL8bY",
#     "client_secret": "EO_a10pqk2sGh4Z-DQHukXPc9hpsMQin_VWjmO0kQ7SQ4K-ZGpBaAgewT41kNQMh54W-slzpSLrJz6f_"
# })

import paypalrestsdk
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

client_id = os.getenv("PAYPAL_CLIENT_ID")
client_secret = os.getenv("PAYPAL_CLIENT_SECRET")
mode = os.getenv("PAYPAL_MODE", "sandbox")

print(f"PayPal Client ID: {client_id}")
print(f"PayPal Client Secret: {client_secret}")
print(f"PayPal Mode: {mode}")

paypalrestsdk.configure({
    "mode": mode,  # Default to sandbox if not set
    "client_id": client_id,
    "client_secret": client_secret
})