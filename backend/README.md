# AI-Powered Investment Dashboard Backend

## Directory Structure
```
backend/
├── app.py              # Main Flask application
├── .env               # Environment variables
├── requirements.txt   # Python dependencies
├── models/           # Database models
├── routes/           # API routes
│   ├── auth.py      # Authentication routes
│   ├── portfolio.py # Portfolio management routes
│   ├── stocks.py    # Stock market data routes
│   └── chatbot.py   # AI chatbot routes
├── services/         # Business logic
│   ├── angel_one.py # Angel One API integration
│   ├── groq_ai.py   # Groq AI integration
│   └── portfolio.py # Portfolio management logic
└── utils/           # Utility functions
```

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
- Copy `.env.example` to `.env`
- Fill in your API keys and configuration

4. Run the application:
```bash
python app.py
```

The server will start at http://localhost:5000

## API Endpoints

- `GET /api/health`: Health check endpoint
- `POST /api/auth/login`: User authentication
- `GET /api/portfolio`: Get user portfolio
- `GET /api/stocks/live`: Get live stock data
- `POST /api/chatbot/query`: Query the AI chatbot

More endpoints will be documented as they are implemented. 