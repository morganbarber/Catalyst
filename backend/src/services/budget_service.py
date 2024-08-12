from flask_jwt_extended import get_jwt_identity, jwt_required
from models import Budget, Income, Expense, Goal, Investment, db
from schemas import BudgetSchema
from werkzeug.exceptions import BadRequest, NotFound
from flask import jsonify
import logging

budget_schema = BudgetSchema()
budgets_schema = BudgetSchema(many=True)

class BudgetService:

    @staticmethod
    @jwt_required()
    def create_budget(budget_data):
        user_id = get_jwt_identity()
        errors = budget_schema.validate(budget_data)
        if errors:
            logging.error(f"Validation errors while creating budget: {errors}")
            raise BadRequest(errors)

        try:
            # Fetch user incomes, expenses, goals, and investments
            incomes = Income.query.filter_by(user_id=user_id).all()
            expenses = Expense.query.filter_by(user_id=user_id).all()
            goals = Goal.query.filter_by(user_id=user_id).all()
            investments = Investment.query.filter_by(user_id=user_id).all()

            total_income = sum(income.amount for income in incomes)
            total_expense = sum(expense.amount for expense in expenses)
            total_goal_amount = sum(goal.target_amount for goal in goals)
            total_investment = sum(investment.amount for investment in investments)

            emergency_fund = total_income * 0.10

            discretionary_spending = total_income * 0.20

            investing_fund = remaining_budget * 0.50
            goal_fund = remaining_budget * 0.50

            remaining_budget = total_income - (total_expense + total_goal_amount + emergency_fund + discretionary_spending + goal_fund + investing_fund)

            budget = Budget(
                user_id=user_id,
                name=budget_data['name'],
                total_amount=remaining_budget,
                description=budget_data.get('description'),
                emergency_fund=emergency_fund,
                discretionary_spending=discretionary_spending,
                remaining_budget=remaining_budget,
                total_income=total_income,
                total_expense=total_expense,
                total_investment=total_investment,
                investment_fund=investing_fund,
                goal_fund=goal_fund
            )
            db.session.add(budget)
            db.session.commit()
            logging.info(f"Budget created successfully: {budget}")

            return budget_schema.dump(budget)
        except Exception as e:
            logging.error(f"Error while creating budget: {str(e)}")
            raise BadRequest("An error occurred while creating the budget")

    @staticmethod
    @jwt_required()
    def get_budgets():
        user_id = get_jwt_identity()
        try:
            budgets = Budget.query.filter_by(user_id=user_id).all()
            logging.info(f"Retrieved budgets for user {user_id}: {budgets}")
            return budgets_schema.dump(budgets)
        except Exception as e:
            logging.error(f"Error while retrieving budgets: {str(e)}")
            raise BadRequest("An error occurred while retrieving budgets")

    @staticmethod
    @jwt_required()
    def get_budget(budget_id):
        user_id = get_jwt_identity()
        try:
            budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
            if not budget:
                logging.error(f"Budget not found: {budget_id} for user {user_id}")
                raise NotFound('Budget not found')
            logging.info(f"Retrieved budget: {budget}")
            return budget_schema.dump(budget)
        except Exception as e:
            logging.error(f"Error while retrieving budget: {str(e)}")
            raise BadRequest("An error occurred while retrieving the budget")

    @staticmethod
    @jwt_required()
    def update_budget(budget_id, budget_data):
        user_id = get_jwt_identity()
        try:
            budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
            if not budget:
                logging.error(f"Budget not found: {budget_id} for user {user_id}")
                raise NotFound('Budget not found')

            errors = budget_schema.validate(budget_data)
            if errors:
                logging.error(f"Validation errors while updating budget: {errors}")
                raise BadRequest(errors)

            budget.name = budget_data.get('name', budget.name)
            budget.total_amount = budget_data.get('total_amount', budget.total_amount)
            budget.start_date = budget_data.get('start_date', budget.start_date)
            budget.end_date = budget_data.get('end_date', budget.end_date)
            budget.description = budget_data.get('description', budget.description)

            db.session.commit()
            logging.info(f"Budget updated successfully: {budget}")

            return budget_schema.dump(budget)
        except Exception as e:
            logging.error(f"Error while updating budget: {str(e)}")
            raise BadRequest("An error occurred while updating the budget")

    @staticmethod
    @jwt_required()
    def delete_budget(budget_id):
        user_id = get_jwt_identity()
        try:
            budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
            if not budget:
                logging.error(f"Budget not found: {budget_id} for user {user_id}")
                raise NotFound('Budget not found')

            db.session.delete(budget)
            db.session.commit()
            logging.info(f"Budget deleted successfully: {budget_id}")

            return jsonify({'message': 'Budget deleted successfully'})
        except Exception as e:
            logging.error(f"Error while deleting budget: {str(e)}")
            raise BadRequest("An error occurred while deleting the budget")
