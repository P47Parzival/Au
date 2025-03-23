import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Static portfolio data
STATIC_PORTFOLIO = {
    "stocks": [
        {"symbol": "HYUNDAI", "quantity": 7, "buy_price": 1960},
        {"symbol": "TATAMOTORS", "quantity": 55, "buy_price": 861.01}
    ],
    "investment_goal": "Long-term wealth generation",
    "risk_tolerance": "Medium"
}

class GeminiService:
    def __init__(self):
        genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
        self.model = genai.GenerativeModel('gemini-pro')

    def generate_response(self, user_query):
        try:
            # Calculate portfolio metrics
            total_investment = sum(stock["quantity"] * stock["buy_price"] for stock in STATIC_PORTFOLIO["stocks"])
            portfolio_weights = {
                stock["symbol"]: (stock["quantity"] * stock["buy_price"] / total_investment) * 100 
                for stock in STATIC_PORTFOLIO["stocks"]
            }

            # Construct the analysis prompt
            analysis_prompt = f"""
            You are a financial advisor. Here is the static portfolio information:

            Holdings:
            {[f"- {stock['symbol']}: {stock['quantity']} shares at ₹{stock['buy_price']}" for stock in STATIC_PORTFOLIO['stocks']]}

            Total Investment: ₹{total_investment:,.2f}
            Portfolio Weights: {portfolio_weights}
            Investment Goal: {STATIC_PORTFOLIO['investment_goal']}
            Risk Tolerance: {STATIC_PORTFOLIO['risk_tolerance']}

            User Question: {user_query}

            Please provide your analysis and advice in response to the user's specific question in short (100 words max)

            response = self.model.generate_content(analysis_prompt)
            return response.text

        except Exception as e:
            print(f"Gemini API Error: {str(e)}")
            return "I apologize, but I encountered an error. Please try again."

# Create singleton instance
gemini_service = GeminiService() 