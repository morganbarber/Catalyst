from flask_jwt_extended import get_jwt_identity, jwt_required
from models import Budget, db
from schemas import BudgetSchema
from werkzeug.exceptions import BadRequest, NotFound
from flask import jsonify

budget_schema = BudgetSchema()
budgets_schema = BudgetSchema(many=True)

class BudgetService:

    @staticmethod
    @jwt_required()
    def create_budget(budget_data):
        user_id = get_jwt_identity()
        errors = budget_schema.validate(budget_data)
        if errors:
            raise BadRequest(errors)

        budget = Budget(
            user_id=user_id,
            name=budget_data['name'],
            total_amount=budget_data['total_amount'],
            start_date=budget_data['start_date'],
            end_date=budget_data['end_date'],
            description=budget_data.get('description')
        )
        db.session.add(budget)
        db.session.commit()

        return budget_schema.dump(budget)

    @staticmethod
    @jwt_required()
    def get_budgets():
        user_id = get_jwt_identity()
        budgets = Budget.query.filter_by(user_id=user_id).all()
        return budgets_schema.dump(budgets)

    @staticmethod
    @jwt_required()
    def get_budget(budget_id):
        user_id = get_jwt_identity()
        budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
        if not budget:
            raise NotFound('Budget not found')
        return budget_schema.dump(budget)

    @staticmethod
    @jwt_required()
    def update_budget(budget_id, budget_data):
        user_id = get_jwt_identity()
        budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
        if not budget:
            raise NotFound('Budget not found')

        errors = budget_schema.validate(budget_data)
        if errors:
            raise BadRequest(errors)

        budget.name = budget_data.get('name', budget.name)
        budget.total_amount = budget_data.get('total_amount', budget.total_amount)
        budget.start_date = budget_data.get('start_date', budget.start_date)
        budget.end_date = budget_data.get('end_date', budget.end_date)
        budget.description = budget_data.get('description', budget.description)

        db.session.commit()

        return budget_schema.dump(budget)

    @staticmethod
    @jwt_required()
    def delete_budget(budget_id):
        user_id = get_jwt_identity()
        budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
        if not budget:
            raise NotFound('Budget not found')

        db.session.delete(budget)
        db.session.commit()

        return jsonify({'message': 'Budget deleted successfully'})