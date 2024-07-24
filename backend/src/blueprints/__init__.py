from .auth import auth_bp
from .income import income_bp
from .expense import expense_bp
from .llm import llm_bp

blueprints = [auth_bp, income_bp, expense_bp]