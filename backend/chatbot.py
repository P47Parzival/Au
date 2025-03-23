from flask import jsonify, request
from groq import Groq
from typing import Dict, Any
import os

class FinancialAdvisor:
    def __init__(self) -> None:
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
    def generate_response(self, user_query: str, portfolio_data: Dict[str, Any]) -> str:
        system_prompt = """You are an experienced financial advisor. 
        Analyze the user's portfolio and provide personalized investment advice.
        Base your recommendations on their current holdings and market conditions.
        Always maintain a professional tone and consider risk management."""
        
        portfolio_context = f"Current Portfolio: {portfolio_data}"
        
        response = self.client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"{portfolio_context}\n\nUser Query: {user_query}"}
            ],
            temperature=0.7,
            max_tokens=2048
        )
        
        return response.choices[0].message.content

@app.route('/api/chat', methods=['POST'])
def chat() -> Dict[str, str]:
    data = request.json
    user_query = data.get('query')
    portfolio_data = data.get('portfolio')
    
    advisor = FinancialAdvisor()
    response = advisor.generate_response(user_query, portfolio_data)
    
    return jsonify({'response': response})