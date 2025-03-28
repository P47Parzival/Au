from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv
import os
import requests
from functools import wraps
import time
import google.generativeai as genai

# Import routes
from routes.stocks import stocks_bp
from routes.auth import auth_bp
from routes.payment import payment_bp

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Set secret key with a default value if not in environment
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-super-secret-key-12345')

# Enable CORS with proper configuration
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins=["http://localhost:3000"])

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(stocks_bp, url_prefix='/api/stocks')
app.register_blueprint(payment_bp, url_prefix='/api')  # This will handle /api/create-payment and /api/execute-payment

# Static portfolio data
STATIC_PORTFOLIO = {
    "stocks": [
        {"symbol": "HYUNDAI", "quantity": 7, "buy_price": 1960},
        {"symbol": "TATAMOTORS", "quantity": 55, "buy_price": 861.01}
    ],
    "investment_goal": "Long-term wealth generation",
    "risk_tolerance": "Medium"
}

# Initialize Gemini
try:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY is missing in .env file")
    
    # Configure Gemini
    genai.configure(api_key=GEMINI_API_KEY)
    
    # List available models
    models = [m.name for m in genai.list_models()]
    print("📋 Available models:", models)
    
    # Find the most suitable Gemini model
    preferred_models = [
        "models/gemini-1.5-pro",
        "models/gemini-1.5-pro-latest",
        "models/gemini-1.5-pro-001",
        "models/gemini-1.5-pro-002"
    ]
    
    model_name = None
    for preferred_model in preferred_models:
        if preferred_model in models:
            model_name = preferred_model
            break
    
    if not model_name:
        raise ValueError("No suitable Gemini model found in available models")
    
    # Initialize the model
    model = genai.GenerativeModel(model_name)
    print(f"✅ Gemini API configured successfully using model: {model_name}")
    
except Exception as e:
    print(f"❌ Error configuring Gemini API: {str(e)}")
    model = None

@app.route("/api/chat/test", methods=["GET"])
def test_gemini():
    """Test route to verify Gemini API connectivity"""
    try:
        if not model:
            return jsonify({"error": "Gemini API not configured"}), 500

        # Simple test prompt
        test_prompt = """Respond with a simple 'Hello! Gemini API is working!' if you receive this message."""
        
        print("🤖 Testing Gemini API connection...")
        response = model.generate_content(test_prompt)
        
        if not response or not response.text:
            return jsonify({"error": "No response from Gemini"}), 500
            
        return jsonify({
            "status": "success",
            "response": response.text,
            "model": model._model_name
        })
    except Exception as e:
        print(f"❌ Gemini API test failed: {str(e)}")
        return jsonify({"error": f"Gemini API test failed: {str(e)}"}), 500

@app.route("/api/chat", methods=["POST"])
def chat():
    """Chat endpoint that uses Gemini API to analyze portfolio and answer questions"""
    try:
        # Check if Gemini is configured
        if not model:
            return jsonify({"error": "Gemini API not configured"}), 500

        # Get message from request
        data = request.get_json()
        if not data or "message" not in data:
            return jsonify({"error": "Missing message in request"}), 400

        message = data["message"]
        print(f"📝 Received message: {message}")

        # Create prompt for natural paragraph response
        prompt = f"""As a financial advisor, analyze this portfolio and answer {message} in a clear, concise way.

Portfolio:
- HYUNDAI: 7 shares at ₹1960
- TATAMOTORS: 55 shares at ₹861.01
- Investment Goal: Long-term wealth generation
- Risk Tolerance: Medium

Provide a brief analysis in 3-4 short paragraphs covering:
1. Current portfolio status and composition
2. Key risks and concerns
3. Specific recommendations and action items

Keep the total response under 150 words and focus on actionable insights. Use simple, direct language."""

        # Get response from Gemini
        print("🤖 Requesting Gemini response...")
        response = model.generate_content(prompt)

        if not response or not response.text:
            return jsonify({"error": "No response from Gemini"}), 500

        # Format the response
        formatted_response = response.text
        # Remove markdown symbols
        formatted_response = formatted_response.replace('*', '')
        formatted_response = formatted_response.replace('#', '')
        formatted_response = formatted_response.replace('**', '')
        
        # Ensure proper paragraph breaks
        # Split into paragraphs and clean up
        paragraphs = [p.strip() for p in formatted_response.split('\n\n') if p.strip()]
        formatted_response = '\n\n'.join(paragraphs)
        
        # Remove any trailing/leading whitespace while preserving paragraph breaks
        formatted_response = formatted_response.strip()

        print("✅ Got response from Gemini")
        return jsonify({"response": formatted_response})

    except Exception as e:
        print(f"❌ Error in chat endpoint: {str(e)}")
        return jsonify({"error": f"Failed to process request: {str(e)}"}), 500

# Basic route for testing
@app.route('/api/health')
def health_check():
    return {"status": "healthy", "message": "Backend is running"}

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000)
