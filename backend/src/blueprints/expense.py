from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services import ExpenseTrackingService
from werkzeug.exceptions import NotFound, BadRequest

expense_bp = Blueprint('expense', __name__)

@expense_bp.route('/expense', methods=['POST'])
@jwt_required()
def create_expense():
    try:
        expense_data = request.get_json()
        response = ExpenseTrackingService.create_expense(expense_data)
        return jsonify(response), 201
    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@expense_bp.route('/expense', methods=['GET'])
@jwt_required()
def get_expenses():
    try:
        response = ExpenseTrackingService.get_expenses()
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@expense_bp.route('/expense/<int:expense_id>', methods=['GET'])
@jwt_required()
def get_expense(expense_id):
    try:
        response = ExpenseTrackingService.get_expense(expense_id)
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@expense_bp.route('/expense/<int:expense_id>', methods=['PUT'])
@jwt_required()
def update_expense(expense_id):
    try:
        expense_data = request.get_json()
        response = ExpenseTrackingService.update_expense(expense_id, expense_data)
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@expense_bp.route('/expense/<int:expense_id>', methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):
    try:
        response = ExpenseTrackingService.delete_expense(expense_id)
        return response, 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500