# src/blueprints/investment.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.investment_service import InvestmentService, PortfolioService
from werkzeug.exceptions import NotFound, BadRequest

investment_bp = Blueprint('investment', __name__)

@investment_bp.route('/investments/recommendations', methods=['GET'])
@jwt_required()
def get_investment_recommendations():
    try:
        response = InvestmentService.get_investment_recommendations()
        return jsonify(response), 200
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@investment_bp.route('/investments', methods=['POST'])
@jwt_required()
def create_investment():
    try:
        investment_data = request.get_json()
        response = InvestmentService.create_investment(investment_data)
        return jsonify(response), 201
    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@investment_bp.route('/investments', methods=['GET'])
@jwt_required()
def get_investments():
    try:
        response = InvestmentService.get_investments()
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        print(e)
        return jsonify({'error': 'Internal server error'}), 500

@investment_bp.route('/investments/<int:investment_id>', methods=['GET'])
@jwt_required()
def get_investment(investment_id):
    try:
        response = InvestmentService.get_investment(investment_id)
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@investment_bp.route('/investments/<int:investment_id>', methods=['PUT'])
@jwt_required()
def update_investment(investment_id):
    try:
        investment_data = request.get_json()
        response = InvestmentService.update_investment(investment_id, investment_data)
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@investment_bp.route('/investments/<int:investment_id>', methods=['DELETE'])
@jwt_required()
def delete_investment(investment_id):
    try:
        response = InvestmentService.delete_investment(investment_id)
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@investment_bp.route('/portfolios', methods=['POST'])
@jwt_required()
def create_portfolio():
    try:
        portfolio_data = request.get_json()
        response = PortfolioService.create_portfolio(portfolio_data)
        return jsonify(response), 201
    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@investment_bp.route('/portfolios', methods=['GET'])
@jwt_required()
def get_portfolios():
    try:
        response = PortfolioService.get_portfolios()
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@investment_bp.route('/portfolios/<int:portfolio_id>', methods=['GET'])
@jwt_required()
def get_portfolio(portfolio_id):
    try:
        response = PortfolioService.get_portfolio(portfolio_id)
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@investment_bp.route('/portfolios/<int:portfolio_id>', methods=['PUT'])
@jwt_required()
def update_portfolio(portfolio_id):
    try:
        portfolio_data = request.get_json()
        response = PortfolioService.update_portfolio(portfolio_id, portfolio_data)
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@investment_bp.route('/portfolios/<int:portfolio_id>', methods=['DELETE'])
@jwt_required()
def delete_portfolio(portfolio_id):
    try:
        response = PortfolioService.delete_portfolio(portfolio_id)
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@investment_bp.route('/portfolio/performance', methods=['GET'])
@jwt_required()
def monitor_performance():
    try:
        response = PortfolioService.monitor_performance()
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@investment_bp.route('/portfolio/adjustments', methods=['GET'])
@jwt_required()
def portfolio_adjustments():
    try:
        response = PortfolioService.portfolio_adjustments()
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@investment_bp.route('/portfolio/historical', methods=['GET'])
@jwt_required()
def get_portfolio_historical_data():
    try:
        portfolio_id = request.args.get('portfolio_id')
        response = PortfolioService.get_portfolio_historical_data(portfolio_id)
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500