from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services import IncomeTrackingService
from werkzeug.exceptions import NotFound, BadRequest

income_bp = Blueprint('income', __name__)

@income_bp.route('/income', methods=['POST'])
@jwt_required()
def create_income():
    try:
        income_data = request.get_json()
        response = IncomeTrackingService.create_income(income_data)
        return jsonify(response), 201
    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@income_bp.route('/income', methods=['GET'])
@jwt_required()
def get_incomes():
    try:
        response = IncomeTrackingService.get_incomes()
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@income_bp.route('/income/<int:income_id>', methods=['GET'])
@jwt_required()
def get_income(income_id):
    try:
        response = IncomeTrackingService.get_income(income_id)
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@income_bp.route('/income/<int:income_id>', methods=['PUT'])
@jwt_required()
def update_income(income_id):
    try:
        income_data = request.get_json()
        response = IncomeTrackingService.update_income(income_id, income_data)
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

@income_bp.route('/income/<int:income_id>', methods=['DELETE'])
@jwt_required()
def delete_income(income_id):
    try:
        response = IncomeTrackingService.delete_income(income_id)
        return response, 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500