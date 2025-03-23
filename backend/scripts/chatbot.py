import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Groq API Key
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Ensure API Key is Set
if not GROQ_API_KEY:
    raise ValueError("❌ GROQ_API_KEY is missing in .env file")

# Chatbot Route
@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Invalid request, no JSON received"}), 400

        user_portfolio = data.get("userPortfolio", {})
        message = data.get("message", "")

        if not user_portfolio or not message:
            return jsonify({"error": "Missing portfolio or message"}), 400

        # Construct AI Prompt
        prompt = f"""
        You are an AI financial advisor. Analyze the user's portfolio and answer their question accordingly.

        ### User Portfolio:
        {user_portfolio}

        ### User Query:
        "{message}"

        Provide a professional, data-driven, and actionable response.
        """

        # Call Groq API (Mistral-7B) - FIXED URL
        headers = {"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"}
        payload = {
            "model": "mistral-saba-24b",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.7,
            "max_tokens": 1024
        }

        response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
        ai_response = response.json()

        # Debugging: Print full API response
        print("\n🔍 Groq API Full Response:", ai_response)

        # Extract AI response safely
        if "choices" in ai_response and ai_response["choices"]:
            return jsonify({"response": ai_response["choices"][0]["message"]["content"]})
        else:
            return jsonify({"error": "AI response format is invalid", "full_response": ai_response}), 500

    except Exception as e:
        print(f"\n⚠️ Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
