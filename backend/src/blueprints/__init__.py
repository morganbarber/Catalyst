from .auth import auth_bp
from .income import income_bp
from .expense import expense_bp
from .llm import llm_bp
from .debt import debt_bp
from .investment import investment_bp
from .tax import tax_bp
from .budget import budget_bp
from .goal import goal_bp

blueprints = [auth_bp, income_bp, expense_bp, llm_bp, debt_bp, investment_bp, tax_bp, budget_bp, goal_bp]