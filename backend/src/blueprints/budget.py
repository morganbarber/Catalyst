from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.budget_service import BudgetService
from werkzeug.exceptions import NotFound, BadRequest

budget_bp = Blueprint('budget', __name__)

@budget_bp.route('/budgets', methods=['POST'])
@jwt_required()
def create_budget():
    try:
        budget_data = request.get_json()
        response = BudgetService.create_budget(budget_data)
        return jsonify(response), 201
    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@budget_bp.route('/budgets', methods=['GET'])
@jwt_required()
def get_budgets():
    try:
        response = BudgetService.get_budgets()
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@budget_bp.route('/budgets/<int:budget_id>', methods=['GET'])
@jwt_required()
def get_budget(budget_id):
    try:
        response = BudgetService.get_budget(budget_id)
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@budget_bp.route('/budgets/<int:budget_id>', methods=['PUT'])
@jwt_required()
def update_budget(budget_id):
    try:
        budget_data = request.get_json()
        response = BudgetService.update_budget(budget_id, budget_data)
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@budget_bp.route('/budgets/<int:budget_id>', methods=['DELETE'])
@jwt_required()
def delete_budget(budget_id):
    try:
        response = BudgetService.delete_budget(budget_id)
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500