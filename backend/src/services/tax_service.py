# src/services/tax_service.py

from flask_jwt_extended import get_jwt_identity
from models import Tax, db
from schemas import TaxSchema
from werkzeug.exceptions import BadRequest, NotFound
from flask import jsonify
from llm.client import client
import logging
import traceback

tax_schema = TaxSchema()
taxes_schema = TaxSchema(many=True)

class TaxService:

    @staticmethod
    def create_tax(tax_data):
        user_id = get_jwt_identity()
        errors = tax_schema.validate(tax_data)
        if errors:
            logging.error(f"Validation errors: {errors}")
            raise BadRequest(errors)

        try:
            tax = Tax(
                user_id=user_id,
                year=tax_data['year'],
                amount=tax_data['amount'],
                description=tax_data.get('description'),
                optimization_strategy=tax_data.get('optimization_strategy')
            )
            db.session.add(tax)
            db.session.commit()
            logging.info(f"Tax created: {tax}")
            return tax_schema.dump(tax)
        except Exception as e:
            logging.error(f"Error creating tax: {str(e)}")
            logging.error(traceback.format_exc())
            raise

    @staticmethod
    def get_taxes():
        user_id = get_jwt_identity()
        try:
            taxes = Tax.query.filter_by(user_id=user_id).all()
            logging.info(f"Taxes retrieved for user {user_id}: {taxes}")
            return taxes_schema.dump(taxes)
        except Exception as e:
            logging.error(f"Error retrieving taxes: {str(e)}")
            logging.error(traceback.format_exc())
            raise

    @staticmethod
    def get_tax(tax_id):
        user_id = get_jwt_identity()
        try:
            tax = Tax.query.filter_by(id=tax_id, user_id=user_id).first()
            if not tax:
                logging.warning(f"Tax not found: {tax_id}")
                raise NotFound('Tax not found')
            logging.info(f"Tax retrieved: {tax}")
            return tax_schema.dump(tax)
        except Exception as e:
            logging.error(f"Error retrieving tax: {str(e)}")
            logging.error(traceback.format_exc())
            raise

    @staticmethod
    def update_tax(tax_id, tax_data):
        user_id = get_jwt_identity()
        try:
            tax = Tax.query.filter_by(id=tax_id, user_id=user_id).first()
            if not tax:
                logging.warning(f"Tax not found: {tax_id}")
                raise NotFound('Tax not found')

            errors = tax_schema.validate(tax_data)
            if errors:
                logging.error(f"Validation errors: {errors}")
                raise BadRequest(errors)

            tax.year = tax_data.get('year', tax.year)
            tax.amount = tax_data.get('amount', tax.amount)
            tax.description = tax_data.get('description', tax.description)
            tax.optimization_strategy = tax_data.get('optimization_strategy', tax.optimization_strategy)

            db.session.commit()
            logging.info(f"Tax updated: {tax}")
            return tax_schema.dump(tax)
        except Exception as e:
            logging.error(f"Error updating tax: {str(e)}")
            logging.error(traceback.format_exc())
            raise

    @staticmethod
    def delete_tax(tax_id):
        user_id = get_jwt_identity()
        try:
            tax = Tax.query.filter_by(id=tax_id, user_id=user_id).first()
            if not tax:
                logging.warning(f"Tax not found: {tax_id}")
                raise NotFound('Tax not found')

            db.session.delete(tax)
            db.session.commit()
            logging.info(f"Tax deleted: {tax_id}")
            return jsonify({'message': 'Tax deleted successfully'})
        except Exception as e:
            logging.error(f"Error deleting tax: {str(e)}")
            logging.error(traceback.format_exc())
            raise

    @staticmethod
    def optimize_taxes():
        user_id = get_jwt_identity()
        try:
            taxes = Tax.query.filter_by(user_id=user_id).all()
            if not taxes:
                logging.warning(f"No taxes found for optimization for user {user_id}")
                raise NotFound('No taxes found for optimization')

            context = "\n".join([f"Tax Year: {tax.year} - Amount: ${tax.amount}" for tax in taxes])
            response = client.inference(context=context, prompt="tax_optimization")
            logging.info(f"Tax optimization response: {response}")
            return jsonify(response)
        except Exception as e:
            logging.error(f"Error optimizing taxes: {str(e)}")
            logging.error(traceback.format_exc())
            raise