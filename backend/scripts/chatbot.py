from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os
import sys
sys.path.append('..')  # Add parent directory to path
from services.gemini_service import gemini_service

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)
CORS(app)

# Ensure Gemini API Key is Set
if not os.environ.get("GEMINI_API_KEY"):
    raise ValueError("❌ GEMINI_API_KEY is missing in .env file")

# Chatbot Route
@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"error": "Invalid request, no JSON received"}), 400

        message = data.get("message", "")

        if not message:
            return jsonify({"error": "Missing message"}), 400

        # Get response from Gemini service
        response = gemini_service.generate_response(message)
        
        if response:
            return jsonify({"response": response})
        else:
            return jsonify({"error": "Failed to generate response"}), 500

    except Exception as e:
        print(f"\n⚠️ Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
