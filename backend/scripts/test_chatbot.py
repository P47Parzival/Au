import requests
import json

# Define API URL (Ensure Flask server is running)
API_URL = "http://localhost:5000/api/chat"

# Sample user portfolio data
user_portfolio = {
    "stocks": [
        {"symbol": "HYUNDAI", "quantity": 7, "buy_price": 1960},
        {"symbol": "TATAMOTORS", "quantity": 55, "buy_price": 861.01}
    ],
    "investment_goal": "Long-term wealth generation",
    "risk_tolerance": "Medium"
}

# Sample user query
user_message = "How is my portfolio performing? Should I diversify?"

# Prepare request payload
payload = {
    "userPortfolio": user_portfolio,
    "message": user_message
}

# Send POST request to chatbot API
try:
    response = requests.post(API_URL, json=payload)

    if response.status_code != 200:
        print(f"\n⚠️ API Error {response.status_code}: {response.text}")
    else:
        response_data = response.json()
        print("\n✅ **Chatbot Response:**")
        print(response_data.get("response", "No response received."))

except requests.exceptions.RequestException as e:
    print(f"\n⚠️ Request Error: {e}")

except json.JSONDecodeError:
    print("\n⚠️ Error: API did not return valid JSON.")