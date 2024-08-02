from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.goal_service import GoalService
from werkzeug.exceptions import NotFound, BadRequest
import logging

goal_bp = Blueprint('goal', __name__)

@goal_bp.route('/goals', methods=['POST'])
@jwt_required()
def create_goal():
    try:
        goal_data = request.get_json()
        response = GoalService.create_goal(goal_data)
        logging.info(f"Goal created: {response}")
        return jsonify(response), 201
    except BadRequest as e:
        logging.error(f"BadRequest error while creating goal: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logging.error(f"Internal server error while creating goal: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@goal_bp.route('/goals', methods=['GET'])
@jwt_required()
def get_goals():
    try:
        response = GoalService.get_goals()
        logging.info(f"Goals retrieved: {response}")
        return jsonify(response), 200
    except NotFound as e:
        logging.error(f"NotFound error while retrieving goals: {str(e)}")
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        logging.error(f"Internal server error while retrieving goals: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@goal_bp.route('/goals/<int:goal_id>', methods=['GET'])
@jwt_required()
def get_goal(goal_id):
    try:
        response = GoalService.get_goal(goal_id)
        logging.info(f"Goal retrieved: {response}")
        return jsonify(response), 200
    except NotFound as e:
        logging.error(f"NotFound error while retrieving goal {goal_id}: {str(e)}")
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        logging.error(f"Internal server error while retrieving goal {goal_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@goal_bp.route('/goals/<int:goal_id>', methods=['PUT'])
@jwt_required()
def update_goal(goal_id):
    try:
        goal_data = request.get_json()
        response = GoalService.update_goal(goal_id, goal_data)
        logging.info(f"Goal updated: {response}")
        return jsonify(response), 200
    except NotFound as e:
        logging.error(f"NotFound error while updating goal {goal_id}: {str(e)}")
        return jsonify({'error': str(e)}), 404
    except BadRequest as e:
        logging.error(f"BadRequest error while updating goal {goal_id}: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logging.error(f"Internal server error while updating goal {goal_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@goal_bp.route('/goals/<int:goal_id>', methods=['DELETE'])
@jwt_required()
def delete_goal(goal_id):
    try:
        response = GoalService.delete_goal(goal_id)
        logging.info(f"Goal deleted: {goal_id}")
        return jsonify(response), 200
    except NotFound as e:
        logging.error(f"NotFound error while deleting goal {goal_id}: {str(e)}")
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        logging.error(f"Internal server error while deleting goal {goal_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@goal_bp.route('/goals/guidance', methods=['GET'])
@jwt_required()
def goal_guidance():
    try:
        response = GoalService.goal_guidance()
        logging.info(f"Goal guidance provided: {response}")
        return jsonify(response), 200
    except NotFound as e:
        logging.error(f"NotFound error while providing goal guidance: {str(e)}")
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        logging.error(f"Internal server error while providing goal guidance: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500