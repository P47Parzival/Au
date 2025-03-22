from flask import Blueprint, jsonify, request
from services.angel_one import angel_one_service
from flask_cors import cross_origin
from functools import wraps
import jwt
import os
from datetime import datetime, timedelta
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

stocks_bp = Blueprint('stocks', __name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"error": "No token provided"}), 401

        try:
            token = token.split(' ')[1]
            jwt.decode(token, os.getenv('SECRET_KEY'), algorithms=['HS256'])
        except Exception as e:
            logger.error(f"Token validation error: {str(e)}")
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated

@stocks_bp.route('/profile', methods=['GET'])
@cross_origin()
@token_required
def get_profile():
    """Get user's Angel One profile"""
    try:
        profile = angel_one_service.get_profile()
        if profile:
            return jsonify(profile)
        return jsonify({"error": "Failed to fetch profile"}), 400
    except Exception as e:
        logger.error(f"Profile fetch error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@stocks_bp.route('/holdings', methods=['GET'])
@cross_origin()
@token_required
def get_holdings():
    """Get detailed holdings data"""
    try:
        holdings = angel_one_service.get_holdings()
        logger.info(f"Holdings response: {holdings}")
        if holdings and 'data' in holdings:
            return jsonify(holdings)
        return jsonify({"error": "Failed to fetch holdings"}), 400
    except Exception as e:
        logger.error(f"Holdings fetch error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@stocks_bp.route('/positions', methods=['GET'])
@cross_origin()
@token_required
def get_positions():
    """Get current positions"""
    try:
        positions = angel_one_service.get_portfolio_positions()
        logger.info(f"Positions response: {positions}")
        if positions and 'data' in positions:
            return jsonify(positions)
        return jsonify({"error": "Failed to fetch positions"}), 400
    except Exception as e:
        logger.error(f"Positions fetch error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@stocks_bp.route('/portfolio', methods=['GET'])
@cross_origin()
def get_portfolio():
    """Get complete portfolio data for dashboard"""
    try:
        # Get holdings and positions
        holdings = angel_one_service.get_holdings()
        positions = angel_one_service.get_portfolio_positions()

        if not holdings or not positions:
            return jsonify({"error": "Failed to fetch portfolio data"}), 400

        # Calculate total portfolio value and other metrics
        holdings_data = holdings.get('data', [])
        positions_data = positions.get('data', [])

        # Process holdings data
        total_investment = sum(float(holding['averageprice']) * float(holding['quantity']) 
                             for holding in holdings_data)
        total_current_value = sum(float(holding['ltp']) * float(holding['quantity']) 
                                for holding in holdings_data)
        total_pl = sum(float(holding['pnl']) for holding in holdings_data)

        # Calculate daily change from positions
        daily_pl = sum(float(position['dayPl']) for position in positions_data) if positions_data else 0
        daily_change = (daily_pl / total_investment * 100) if total_investment > 0 else 0

        # Get historical data for portfolio value chart
        historical_data = []
        if holdings_data:
            # Get last 30 days data for the first holding as a sample
            from_date = (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d %H:%M")
            to_date = datetime.now().strftime("%Y-%m-%d %H:%M")
            sample_token = holdings_data[0]['symboltoken']
            hist_data = angel_one_service.get_historical_data(sample_token, from_date, to_date)
            if hist_data and 'data' in hist_data:
                historical_data = hist_data['data']

        return jsonify({
            "total_value": total_current_value,
            "holdings": holdings_data,
            "positions": positions_data,
            "historical_data": historical_data,
            "metrics": {
                "daily_change": daily_change,
                "total_investments": total_investment,
                "total_pl": total_pl,
                "daily_pl": daily_pl
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@stocks_bp.route('/price/<token>', methods=['GET'])
@cross_origin()
@token_required
def get_live_price(token):
    """Get live price for a specific stock"""
    price_data = angel_one_service.get_live_price(token)
    if price_data:
        return jsonify(price_data)
    return jsonify({"error": f"Failed to fetch price for {token}"}), 400

@stocks_bp.route('/historical/<token>', methods=['GET'])
@cross_origin()
def get_historical(token):
    """Get historical data for a token"""
    try:
        from_date = request.args.get('from_date', (datetime.now() - timedelta(days=30)).strftime("%Y-%m-%d %H:%M"))
        to_date = request.args.get('to_date', datetime.now().strftime("%Y-%m-%d %H:%M"))
        interval = request.args.get('interval', 'ONE_DAY')

        data = angel_one_service.get_historical_data(token, from_date, to_date, interval)
        if data:
            return jsonify(data)
        return jsonify({"error": f"Failed to fetch historical data for {token}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500 