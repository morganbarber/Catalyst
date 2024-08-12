# src/services/investment_service.py

from models import Investment, Portfolio, User, db
from schemas import InvestmentSchema, PortfolioSchema
from flask_jwt_extended import get_jwt_identity
from werkzeug.exceptions import BadRequest, NotFound
from llm.client import client
from flask import jsonify
import yfinance as yf
from datetime import date, timedelta
from dateutil.relativedelta import relativedelta

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
        
        # validate name is symbol
        if not yf.Ticker(data['name']).info:
            return jsonify({'error': 'Invalid symbol'}), 400

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

        return {'message': 'Investment deleted successfully'}

class PortfolioService:

    @staticmethod
    def create_portfolio(data):
        user_id = get_jwt_identity()
        errors = portfolio_schema.validate(data)
        if errors:
            raise BadRequest(errors)

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
            print(errors)
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
    def get_portfolio_historical_data():
        user_id = get_jwt_identity()
        portfolios = Portfolio.query.filter_by(user_id=user_id).all()
        investments = Investment.query.filter_by(user_id=user_id).all()
        if not portfolios:
            raise NotFound('Portfolio not found')

        data = {}

        today = date.today()
        start_dates = [(today - timedelta(days=30 * i)).replace(day=1) for i in range(1, 7)]

        historical_data = {}

        for portfolio in portfolios:
            for investment in investments:
                if investment.portfolio_id == portfolio.id:
                    
                    recent_data = yf.download(investment.name, start=today - relativedelta(months=6), end=today)
                    historical_data[portfolio.name][investment.name] = recent_data['Close'].values.tolist()
                    for i in historical_data[portfolio.name][investment.name]:
                        historical_data[portfolio.name][investment.name] = int(i) * investment.amount
                        print(historical_data[portfolio.name][investment.name])

        return historical_data
    
    @staticmethod
    def get_stock_price(symbol, date1=None):
        try:
            stock = yf.Ticker(symbol)
        except Exception as e:
            return jsonify({'error': 'Invalid symbol'}), 400
        data = stock.info['currentPrice']
        return data
