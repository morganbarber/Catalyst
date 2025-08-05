from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services import DebtTrackingService, RepaymentPlanService
from werkzeug.exceptions import NotFound, BadRequest

debt_bp = Blueprint('debt', __name__)

@debt_bp.route('/debts', methods=['POST'])
@jwt_required()
def create_debt():
    try:
        debt_data = request.get_json()
        response = DebtTrackingService.create_debt(debt_data)
        return jsonify(response), 201
    except BadRequest:
        return jsonify({'error': 'Bad request: Invalid data format or missing fields.'}), 400
    except Exception:
        return jsonify({'error': 'An internal server error occurred.'}), 500

@debt_bp.route('/debts', methods=['GET'])
@jwt_required()
def get_debts():
    try:
        response = DebtTrackingService.get_debts()
        return jsonify(response), 200
    except NotFound:
        return jsonify({'error': 'No debt records were found.'}), 404
    except Exception:
        return jsonify({'error': 'An internal server error occurred.'}), 500

@debt_bp.route('/debts/<int:debt_id>', methods=['GET'])
@jwt_required()
def get_debt(debt_id):
    try:
        response = DebtTrackingService.get_debt(debt_id)
        return jsonify(response), 200
    except NotFound:
        return jsonify({'error': 'The requested debt was not found.'}), 404
    except Exception:
        return jsonify({'error': 'An internal server error occurred.'}), 500

@debt_bp.route('/debts/<int:debt_id>', methods=['PUT'])
@jwt_required()
def update_debt(debt_id):
    try:
        debt_data = request.get_json()
        response = DebtTrackingService.update_debt(debt_id, debt_data)
        return jsonify(response), 200
    except NotFound:
        return jsonify({'error': 'The debt to update was not found.'}), 404
    except BadRequest:
        return jsonify({'error': 'Bad request: Invalid data format or missing fields.'}), 400
    except Exception:
        return jsonify({'error': 'An internal server error occurred.'}), 500

@debt_bp.route('/debts/<int:debt_id>', methods=['DELETE'])
@jwt_required()
def delete_debt(debt_id):
    try:
        response = DebtTrackingService.delete_debt(debt_id)
        return jsonify(response), 200
    except NotFound:
        return jsonify({'error': 'The debt to delete was not found.'}), 404
    except Exception:
        return jsonify({'error': 'An internal server error occurred.'}), 500

@debt_bp.route('/repayment-plans', methods=['POST'])
@jwt_required()
def create_repayment_plan():
    try:
        plan_data = request.get_json()
        response = RepaymentPlanService.create_repayment_plan(plan_data)
        return jsonify(response), 201
    except BadRequest:
        return jsonify({'error': 'Bad request: Invalid data format or missing fields.'}), 400
    except Exception:
        return jsonify({'error': 'An internal server error occurred.'}), 500

@debt_bp.route('/repayment-plans', methods=['GET'])
@jwt_required()
def get_repayment_plans():
    try:
        response = RepaymentPlanService.get_repayment_plans()
        return jsonify(response), 200
    except NotFound:
        return jsonify({'error': 'No repayment plans were found.'}), 404
    except Exception:
        return jsonify({'error': 'An internal server error occurred.'}), 500

@debt_bp.route('/repayment-plans/<int:plan_id>', methods=['GET'])
@jwt_required()
def get_repayment_plan(plan_id):
    try:
        response = RepaymentPlanService.get_repayment_plan(plan_id)
        return jsonify(response), 200
    except NotFound:
        return jsonify({'error': 'The requested repayment plan was not found.'}), 404
    except Exception:
        return jsonify({'error': 'An internal server error occurred.'}), 500

@debt_bp.route('/repayment-plans/<int:plan_id>', methods=['PUT'])
@jwt_required()
def update_repayment_plan(plan_id):
    try:
        plan_data = request.get_json()
        response = RepaymentPlanService.update_repayment_plan(plan_id, plan_data)
        return jsonify(response), 200
    except NotFound:
        return jsonify({'error': 'The repayment plan to update was not found.'}), 404
    except BadRequest:
        return jsonify({'error': 'Bad request: Invalid data format or missing fields.'}), 400
    except Exception:
        return jsonify({'error': 'An internal server error occurred.'}), 500

@debt_bp.route('/repayment-plans/<int:plan_id>', methods=['DELETE'])
@jwt_required()
def delete_repayment_plan(plan_id):
    try:
        response = RepaymentPlanService.delete_repayment_plan(plan_id)
        return jsonify(response), 200
    except NotFound:
        return jsonify({'error': 'The repayment plan to delete was not found.'}), 404
    except Exception:
        return jsonify({'error': 'An internal server error occurred.'}), 500

@debt_bp.route('/debts/analysis', methods=['GET'])
@jwt_required()
def analyze_repayment():
    try:
        response = DebtTrackingService.analyze_repayment()
        return jsonify(response), 200
    except NotFound:
        return jsonify({'error': 'Data for analysis not found.'}), 404
    except Exception:
        return jsonify({'error': 'An internal server error occurred.'}), 500

@debt_bp.route('/debts/consolidation', methods=['GET'])
@jwt_required()
def debt_consolidation():
    try:
        response = DebtTrackingService.debt_consolidation()
        return jsonify(response), 200
    except NotFound:
        return jsonify({'error': 'Data for consolidation not found.'}), 404
    except Exception:
        return jsonify({'error': 'An internal server error occurred.'}), 500

@debt_bp.route('/repayment-plans/optimization', methods=['GET'])
@jwt_required()
def optimize_repayment():
    try:
        response = RepaymentPlanService.optimize_repayment()
        return jsonify(response), 200
    except NotFound:
        return jsonify({'error': 'Data for optimization not found.'}), 404
    except Exception:
        return jsonify({'error': 'An internal server error occurred.'}), 500