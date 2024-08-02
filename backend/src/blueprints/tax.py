# src/blueprints/tax.py

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services.tax_service import TaxService
from werkzeug.exceptions import NotFound, BadRequest
import logging
import traceback

tax_bp = Blueprint('tax', __name__)

@tax_bp.route('/taxes', methods=['POST'])
@jwt_required()
def create_tax():
    try:
        tax_data = request.get_json()
        response = TaxService.create_tax(tax_data)
        logging.info(f"Tax created: {response}")
        return jsonify(response), 201
    except BadRequest as e:
        logging.error(f"BadRequest error: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logging.error(f"Internal server error: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500

@tax_bp.route('/taxes', methods=['GET'])
@jwt_required()
def get_taxes():
    try:
        response = TaxService.get_taxes()
        logging.info(f"Taxes retrieved: {response}")
        return jsonify(response), 200
    except NotFound as e:
        logging.error(f"NotFound error: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        logging.error(f"Internal server error: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500

@tax_bp.route('/taxes/<int:tax_id>', methods=['GET'])
@jwt_required()
def get_tax(tax_id):
    try:
        response = TaxService.get_tax(tax_id)
        logging.info(f"Tax retrieved: {response}")
        return jsonify(response), 200
    except NotFound as e:
        logging.error(f"NotFound error: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        logging.error(f"Internal server error: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500

@tax_bp.route('/taxes/<int:tax_id>', methods=['PUT'])
@jwt_required()
def update_tax(tax_id):
    try:
        tax_data = request.get_json()
        response = TaxService.update_tax(tax_id, tax_data)
        logging.info(f"Tax updated: {response}")
        return jsonify(response), 200
    except NotFound as e:
        logging.error(f"NotFound error: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 404
    except BadRequest as e:
        logging.error(f"BadRequest error: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logging.error(f"Internal server error: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500

@tax_bp.route('/taxes/<int:tax_id>', methods=['DELETE'])
@jwt_required()
def delete_tax(tax_id):
    try:
        response = TaxService.delete_tax(tax_id)
        logging.info(f"Tax deleted: {tax_id}")
        return jsonify(response), 200
    except NotFound as e:
        logging.error(f"NotFound error: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        logging.error(f"Internal server error: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500

@tax_bp.route('/taxes/optimization', methods=['GET'])
@jwt_required()
def optimize_taxes():
    try:
        response = TaxService.optimize_taxes()
        logging.info(f"Tax optimization response: {response}")
        return jsonify(response), 200
    except NotFound as e:
        logging.error(f"NotFound error: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        logging.error(f"Internal server error: {str(e)}")
        logging.error(traceback.format_exc())
        return jsonify({'error': 'Internal server error'}), 500