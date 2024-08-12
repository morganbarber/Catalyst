# src/services/investment_service.py

from models import Investment, Portfolio, User, db
from schemas import InvestmentSchema, PortfolioSchema
from flask_jwt_extended import get_jwt_identity
from werkzeug.exceptions import BadRequest, NotFound
from llm.client import client
from flask import jsonify
import yfinance as yf
from datetime import date, timedelta

investment_schema = InvestmentSchema()
investments_schema = InvestmentSchema(many=True)
portfolio_schema = PortfolioSchema()
portfolios_schema = PortfolioSchema(many=True)

class InvestmentService:

    @staticmethod
    def get_investment_recommendations():
        user_id = get_jwt_identity()
        # Fetch user risk profile and other relevant data
        # For simplicity, let's assume risk_profile is fetched from user data
        user = User.query.get(user_id)
        risk_profile = user.risk_profile
        context = f"User with risk profile: {risk_profile}"
        response = client.inference(context=context, prompt="investment_recommendations")
        return response

    @staticmethod
    def create_investment(data):
        user_id = get_jwt_identity()
        errors = investment_schema.validate(data)
        if errors:
            raise BadRequest(errors)

        investment = Investment(user_id=user_id, **data)
        db.session.add(investment)
        db.session.commit()

        return investment_schema.dump(investment)

    @staticmethod
    def get_investments():
        user_id = get_jwt_identity()
        investments = Investment.query.filter_by(user_id=user_id).all()
        return investments_schema.dump(investments)

    @staticmethod
    def get_investment(investment_id):
        user_id = get_jwt_identity()
        investment = Investment.query.filter_by(id=investment_id, user_id=user_id).first()
        if not investment:
            raise NotFound('Investment not found')
        return investment_schema.dump(investment)

    @staticmethod
    def update_investment(investment_id, data):
        user_id = get_jwt_identity()
        investment = Investment.query.filter_by(id=investment_id, user_id=user_id).first()
        if not investment:
            raise NotFound('Investment not found')

        errors = investment_schema.validate(data)
        if errors:
            raise BadRequest(errors)

        for key, value in data.items():
            setattr(investment, key, value)

        db.session.commit()

        return investment_schema.dump(investment)

    @staticmethod
    def delete_investment(investment_id):
        user_id = get_jwt_identity()
        investment = Investment.query.filter_by(id=investment_id, user_id=user_id).first()
        if not investment:
            raise NotFound('Investment not found')

        db.session.delete(investment)
        db.session.commit()

        return jsonify({'message': 'Investment deleted successfully'})

class PortfolioService:

    @staticmethod
    def create_portfolio(data):
        user_id = get_jwt_identity()
        errors = portfolio_schema.validate(data)
        if errors:
            raise BadRequest(errors)
        
        # validate that name is a ticker
        if not yf.Ticker(data['name']).info:
            raise BadRequest('Invalid ticker')

        portfolio = Portfolio(user_id=user_id, **data)
        db.session.add(portfolio)
        db.session.commit()

        return portfolio_schema.dump(portfolio)

    @staticmethod
    def get_portfolios():
        user_id = get_jwt_identity()
        portfolios = Portfolio.query.filter_by(user_id=user_id).all()
        return portfolios_schema.dump(portfolios)

    @staticmethod
    def get_portfolio(portfolio_id):
        user_id = get_jwt_identity()
        portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id=user_id).first()
        if not portfolio:
            raise NotFound('Portfolio not found')
        return portfolio_schema.dump(portfolio)

    @staticmethod
    def update_portfolio(portfolio_id, data):
        user_id = get_jwt_identity()
        portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id=user_id).first()
        if not portfolio:
            raise NotFound('Portfolio not found')

        errors = portfolio_schema.validate(data)
        if errors:
            raise BadRequest(errors)

        for key, value in data.items():
            setattr(portfolio, key, value)

        db.session.commit()

        return portfolio_schema.dump(portfolio)

    @staticmethod
    def delete_portfolio(portfolio_id):
        user_id = get_jwt_identity()
        portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id=user_id).first()
        if not portfolio:
            raise NotFound('Portfolio not found')

        db.session.delete(portfolio)
        db.session.commit()

        return jsonify({'message': 'Portfolio deleted successfully'})

    @staticmethod
    def monitor_performance():
        user_id = get_jwt_identity()
        portfolios = Portfolio.query.filter_by(user_id=user_id).all()
        if not portfolios:
            raise NotFound('No portfolios found for performance monitoring')

        context = "\n".join([f"Portfolio: {portfolio.name} - Description: {portfolio.description}" for portfolio in portfolios])
        response = client.inference(context=context, prompt="portfolio_performance")
        return jsonify(response)

    @staticmethod
    def portfolio_adjustments():
        user_id = get_jwt_identity()
        portfolios = Portfolio.query.filter_by(user_id=user_id).all()
        if not portfolios:
            raise NotFound('No portfolios found for adjustments')

        context = "\n".join([f"Portfolio: {portfolio.name} - Description: {portfolio.description}" for portfolio in portfolios])
        response = client.inference(context=context, prompt="portfolio_adjustments")
        return jsonify(response)
    
    @staticmethod
    def get_portfolio_historical_data(portfolio_id):
        user_id = get_jwt_identity()
        portfolio = Portfolio.query.filter_by(id=portfolio_id, user_id=user_id).first()
        if not portfolio:
            raise NotFound('Portfolio not found')

        investments = Investment.query.filter_by(portfolio_id=portfolio_id).all()
        historical_data = {}

        today = date.today()
        start_dates = [(today - timedelta(days=30 * i)).replace(day=1) for i in range(1, 7)]

        for investment in investments:
            ticker_data = {}
            ticker = yf.Ticker(investment.name)

            for i, start_date in enumerate(start_dates):
                end_date = (start_date + timedelta(days=30)).replace(day=1) - timedelta(days=1)
                # Fetch data only if it's not the current month (to avoid incomplete data)
                if end_date < today:
                    data = ticker.history(start=start_date, end=end_date)
                    ticker_data[start_date.strftime('%Y-%m')] = data['Close'].tolist()
            
            historical_data[investment.name] = ticker_data

        return jsonify(historical_data)