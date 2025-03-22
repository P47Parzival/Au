from SmartApi import SmartConnect
import pyotp
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AngelOneService:
    def __init__(self):
        self.trading_api_key = "ihOGtndl"
        self.publisher_api_key = "xjz7Ko9s"
        self.client_id = None
        self.pin = None
        self.totp_key = None
        self.trading_api = None
        self.market_api = None
        self.refresh_token = None
        self.access_token = None

    def set_credentials(self, client_id, pin, totp_key):
        """Set credentials for the service"""
        self.client_id = client_id
        self.pin = pin
        self.totp_key = totp_key

    def connect(self):
        """Connect to Angel One API"""
        try:
            if not all([self.client_id, self.pin, self.totp_key]):
                logger.error("Credentials not set")
                return False

            # Connect with trading API
            self.trading_api = SmartConnect(api_key=self.trading_api_key)
            totp = pyotp.TOTP(self.totp_key).now()
            
            logger.info(f"Attempting to connect with client_id: {self.client_id}")
            data = self.trading_api.generateSession(
                self.client_id,
                self.pin,
                totp
            )
            
            if data['status']:
                self.refresh_token = data['data']['refreshToken']
                self.access_token = data['data']['jwtToken']
                logger.info("Successfully connected to Trading API")
                
                # Connect with market data API
                self.market_api = SmartConnect(api_key=self.publisher_api_key)
                market_data = self.market_api.generateSession(
                    self.client_id,
                    self.pin,
                    totp
                )
                
                if market_data['status']:
                    logger.info("Successfully connected to both Trading and Market Data APIs")
                    return True
                else:
                    logger.error(f"Failed to connect to Market Data API: {market_data['message']}")
                    return False
            else:
                logger.error(f"Failed to connect to Trading API: {data['message']}")
                return False
                
        except Exception as e:
            logger.error(f"Error connecting to Angel One API: {str(e)}")
            return False

    def get_profile(self):
        """Get user profile information"""
        try:
            if not self.trading_api:
                if not self.connect():
                    return None
            return self.trading_api.getProfile(self.refresh_token)
        except Exception as e:
            logger.error(f"Error fetching profile: {str(e)}")
            return None

    def get_holdings(self):
        """Get user holdings"""
        try:
            if not self.trading_api:
                if not self.connect():
                    return None
            return self.trading_api.holding()
        except Exception as e:
            logger.error(f"Error fetching holdings: {str(e)}")
            return None

    def get_portfolio_positions(self):
        """Get portfolio positions"""
        try:
            if not self.trading_api:
                if not self.connect():
                    return None
            return self.trading_api.position()
        except Exception as e:
            logger.error(f"Error fetching positions: {str(e)}")
            return None

    def get_live_price(self, token, exchange="NSE"):
        """Get live price for a token"""
        try:
            if not self.market_api:
                if not self.connect():
                    return None
            
            ltpData = self.market_api.ltpData(
                exchange=exchange,
                tradingsymbol=token,
                symboltoken=token
            )
            return ltpData
        except Exception as e:
            logger.error(f"Error fetching live price for {token}: {str(e)}")
            return None

    def get_historical_data(self, token, from_date, to_date, interval="ONE_DAY"):
        """Get historical data for a token"""
        try:
            if not self.market_api:
                if not self.connect():
                    return None

            params = {
                "exchange": "NSE",
                "symboltoken": token,
                "interval": interval,
                "fromdate": from_date,
                "todate": to_date
            }
            return self.market_api.getCandleData(params)
        except Exception as e:
            logger.error(f"Error fetching historical data: {str(e)}")
            return None

# Create a singleton instance
angel_one_service = AngelOneService() 