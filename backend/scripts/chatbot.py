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

# Configure CORS
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "expose_headers": ["Content-Type"]
    }
})

# Ensure Gemini API Key is Set
if not os.environ.get("GEMINI_API_KEY"):
    raise ValueError("❌ GEMINI_API_KEY is missing in .env file")

# Chatbot Route
@app.route("/api/chat", methods=["POST"])
def chat():
    try:
        print("📝 Received chat request")
        data = request.get_json()

        if not data:
            print("❌ No JSON data received")
            return jsonify({"error": "Invalid request, no JSON received"}), 400

        message = data.get("message", "")
        print(f"📨 Message received: {message}")

        if not message:
            print("❌ Missing message in request")
            return jsonify({"error": "Missing message"}), 400

        # Get response from Gemini service
        print("🤖 Requesting response from Gemini...")
        response = gemini_service.generate_response(message)
        
        if response:
            print("✅ Gemini response received")
            print(f"📤 Response: {response}")
            return jsonify({"response": response})
        else:
            print("❌ No response from Gemini")
            return jsonify({"error": "Failed to generate response"}), 500

    except Exception as e:
        print(f"❌ Error in chat endpoint: {str(e)}")
        return jsonify({"error": f"Failed to process request: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=True)
