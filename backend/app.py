from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from dotenv import load_dotenv
import os

# Import routes
from routes.stocks import stocks_bp
from routes.auth import auth_bp

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key')

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

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000) 