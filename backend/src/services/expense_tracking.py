# expense_tracking.py

from flask import request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import Expense, db
from schemas import ExpenseSchema
from werkzeug.exceptions import BadRequest, NotFound

expense_schema = ExpenseSchema()
expenses_schema = ExpenseSchema(many=True)

class ExpenseTrackingService:

    @staticmethod
    @jwt_required()
    def create_expense(expense_data):
        """Creates a new expense record for the current user.

        Args:
            expense_data (dict): Expense data from the request.

        Returns:
            dict: The created expense record.

        Raises:
            BadRequest: If the expense data is invalid.
        """
        user_id = get_jwt_identity()
        errors = expense_schema.validate(expense_data)
        if errors:
            raise BadRequest(errors)

        expense = Expense(
            user_id=user_id,
            name=expense_data['name'],
            amount=expense_data['amount'],
            description=expense_data.get('description'),
            frequency=expense_data['frequency'],
            category=expense_data['category'],
            color=expense_data.get('color'),
            date=expense_data.get('date')
        )
        db.session.add(expense)
        db.session.commit()

        return expense_schema.dump(expense)

    @staticmethod
    @jwt_required()
    def get_expenses():
        """Retrieves all expenses for the current user.

        Args:
            user_id (int, optional): User ID to filter expenses. Defaults to None (current user).

        Returns:
            list: List of expense records.

        Raises:
            NotFound: If no expenses are found for the user.
        """
        expenses = Expense.query.filter_by(user_id=get_jwt_identity()).all()

        return expenses_schema.dump(expenses)

    @staticmethod
    @jwt_required()
    def get_expense(expense_id):
        """Retrieves a single expense record.

        Args:
            expense_id (int): ID of the expense to retrieve.

        Returns:
            dict: Expense record.

        Raises:
            NotFound: If the expense is not found.
        """
        expense = Expense.query.get(expense_id)
        if not expense:
            raise NotFound('Expense not found')

        return expense_schema.dump(expense)

    @staticmethod
    @jwt_required()
    def update_expense(expense_id, expense_data):
        """Updates an existing expense record.

        Args:
            expense_id (int): ID of the expense to update.
            expense_data (dict): Expense data for the update.

        Returns:
            dict: The updated expense record.

        Raises:
            NotFound: If the expense is not found.
            BadRequest: If the expense data is invalid.
        """
        user_id = get_jwt_identity()
        expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
        if not expense:
            raise NotFound('Expense not found')

        errors = expense_schema.validate(expense_data)
        if errors:
            raise BadRequest(errors)

        expense.name = expense_data.get('name', expense.name)
        expense.amount = expense_data.get('amount', expense.amount)
        expense.description = expense_data.get('description', expense.description)
        expense.frequency = expense_data.get('frequency', expense.frequency)
        expense.category = expense_data.get('category', expense.category)
        expense.color = expense_data.get('color', expense.color)
        expense.date = expense_data.get('date', expense.date)

        db.session.commit()

        return expense_schema.dump(expense)

    @staticmethod
    @jwt_required()
    def delete_expense(expense_id):
        """Deletes an expense record.

        Args:
            expense_id (int): ID of the expense to delete.

        Returns:
            dict: Success message.

        Raises:
            NotFound: If the expense is not found.
        """
        user_id = get_jwt_identity()
        expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
        if not expense:
            raise NotFound('Expense not found')

        db.session.delete(expense)
        db.session.commit()

        return jsonify({'message': 'Expense deleted successfully'})