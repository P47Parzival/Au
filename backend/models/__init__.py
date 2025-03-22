from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import models after db initialization to avoid circular imports
from .user import User
from .portfolio import Portfolio
from .stock import Stock 