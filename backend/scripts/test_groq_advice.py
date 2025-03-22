import os
from groq import Groq
from dotenv import load_dotenv

# Load API key from .env file
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize Groq client with API key
client = Groq(api_key=GROQ_API_KEY)

# Function to generate investment insights based on user portfolio
def get_investment_advice(portfolio):
    """Fetch AI-powered investment advice based on user portfolio"""
    try:
        completion = client.chat.completions.create(
            model="llama-3.1-8b-instant",  # Ensure model name is correct
            messages=[
                {
                    "role": "system",
                    "content": "You are an AI-powered financial advisor specializing in investment portfolio management. Your goal is to analyze a user’s stock holdings, assess risk, and provide actionable investment insights.\n\n"
                               "### Guidelines for Response:\n"
                               "- Portfolio Analysis: Assess the user's current investments, diversification, and risk exposure.\n"
                               "- Risk Level Assessment: Categorize portfolio risk as Low, Medium, or High based on asset allocation.\n"
                               "- Market Trend Awareness: Factor in historical stock performance and sector trends before giving advice.\n"
                               "- Investment Strategy Suggestions: Recommend rebalancing strategies such as:\n"
                               "  - Diversification: If the portfolio is sector-heavy, suggest spreading across industries.\n"
                               "  - Reallocation: Adjust stock weightage based on risk appetite and financial goals.\n"
                               "  - Long-term vs Short-term Holdings: Guide users on when to hold or exit positions.\n"
                               "- Exit & Re-Entry Points: Suggest optimal stock selling or buying prices based on historical patterns.\n"
                               "- Tax Optimization Tips: If relevant, recommend strategies to minimize capital gains tax.\n\n"
                               "### Response Format:\n"
                               "Provide clear, structured, and data-driven insights with a friendly yet professional tone.\n"
                               "Example Response:\n"
                               "\"Your portfolio is 70% IT-focused, exposing you to sectoral risk. Consider reducing IT allocation to 50% and diversifying into energy and banking stocks. Based on historical trends, TCS might be a good buy if it falls below ₹3,800. You may also benefit from tax-loss harvesting by exiting underperforming stocks before March 31.\"\n\n"
                               "Be concise, factual, and avoid making absolute predictions. Your role is to guide users based on data-driven insights, not speculate on market movements."
                },
                {
                    "role": "user",
                    "content": f"Analyze the following portfolio and provide investment advice: {portfolio}"
                }
            ],
            temperature=0.8,
            max_tokens=1024,  # ✅ Corrected parameter name
            top_p=0.9,
            stream=True
        )

        # Stream response output
        for chunk in completion:
            if chunk.choices[0].delta.content:
                print(chunk.choices[0].delta.content, end="")

    except Exception as e:
        print(f"\n⚠️ Error fetching investment advice: {e}")

# Example Portfolio (Replace with real user data)
user_portfolio = {
    "stocks": [
        {"symbol": "TCS", "quantity": 10, "buy_price": 3700},
        {"symbol": "INFY", "quantity": 5, "buy_price": 1500},
        {"symbol": "HDFC", "quantity": 8, "buy_price": 2200}
    ],
    "investment_goal": "Long-term wealth generation",
    "risk_tolerance": "Medium"
}

# Get AI investment advice
get_investment_advice(user_portfolio)
