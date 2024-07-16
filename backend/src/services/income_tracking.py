# income_tracking.py

from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import Income, db
from schemas import IncomeSchema
from werkzeug.exceptions import BadRequest, NotFound

income_schema = IncomeSchema()
incomes_schema = IncomeSchema(many=True)

class IncomeTrackingService:

    @staticmethod
    @jwt_required()
    def create_income(income_data):
        """Creates a new income record for the current user.

        Args:
            income_data (dict): Income data from the request.

        Returns:
            dict: The created income record.

        Raises:
            BadRequest: If the income data is invalid.
        """
        user_id = get_jwt_identity()
        errors = income_schema.validate(income_data)
        if errors:
            raise BadRequest(errors)

        income = Income(
            user_id=user_id,
            name=income_data['name'],
            amount=income_data['amount'],
            description=income_data.get('description'),
            frequency=income_data['frequency'],
            date=income_data.get('date')
        )
        db.session.add(income)
        db.session.commit()

        return income_schema.dump(income)

    @staticmethod
    @jwt_required()
    def get_incomes(user_id=None):
        """Retrieves all incomes for the current user.

        Args:
            user_id (int, optional): User ID to filter incomes. Defaults to None (current user).

        Returns:
            list: List of income records.

        Raises:
            NotFound: If no incomes are found for the user.
        """
        if user_id is None:
            user_id = get_jwt_identity()
        incomes = Income.query.filter_by(user_id=user_id).all()
        if not incomes:
            raise NotFound('No incomes found')

        return incomes_schema.dump(incomes)

    @staticmethod
    @jwt_required()
    def get_income(income_id):
        """Retrieves a single income record.

        Args:
            income_id (int): ID of the income to retrieve.

        Returns:
            dict: Income record.

        Raises:
            NotFound: If the income is not found.
        """
        income = Income.query.get(income_id)
        if not income:
            raise NotFound('Income not found')

        return income_schema.dump(income)

    @staticmethod
    @jwt_required()
    def update_income(income_id, income_data):
        """Updates an existing income record.

        Args:
            income_id (int): ID of the income to update.
            income_data (dict): Income data for the update.

        Returns:
            dict: The updated income record.

        Raises:
            NotFound: If the income is not found.
            BadRequest: If the income data is invalid.
        """
        user_id = get_jwt_identity()
        income = Income.query.filter_by(id=income_id, user_id=user_id).first()
        if not income:
            raise NotFound('Income not found')

        errors = income_schema.validate(income_data)
        if errors:
            raise BadRequest(errors)

        income.name = income_data.get('name', income.name)
        income.amount = income_data.get('amount', income.amount)
        income.description = income_data.get('description', income.description)
        income.frequency = income_data.get('frequency', income.frequency)
        income.date = income_data.get('date', income.date)

        db.session.commit()

        return income_schema.dump(income)

    @staticmethod
    @jwt_required()
    def delete_income(income_id):
        """Deletes an income record.

        Args:
            income_id (int): ID of the income to delete.

        Returns:
            dict: Success message.

        Raises:
            NotFound: If the income is not found.
        """
        user_id = get_jwt_identity()
        income = Income.query.filter_by(id=income_id, user_id=user_id).first()
        if not income:
            raise NotFound('Income not found')

        db.session.delete(income)
        db.session.commit()

        return jsonify({'message': 'Income deleted successfully'})