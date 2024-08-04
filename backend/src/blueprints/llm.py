from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from llm import client, services
from werkzeug.exceptions import NotFound, BadRequest

from llm import Services

llm_bp = Blueprint('llm', __name__)
llm_client = client()
llm_services = Services(llm_client)
    
@jwt_required()
@llm_bp.route('/score_finances', methods=['GET'])
def score_finances():
    try:
        response = llm_services.score_finances()
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'})

@jwt_required
@llm_bp.route('/chat', methods=['POST'])
def chat():
    try:
        response = llm_services.chat(request.get_json())
        return jsonify(response), 200
    except NotFound as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Internal server error'})