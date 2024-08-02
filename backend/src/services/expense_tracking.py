from models import Expense, db
from schemas import ExpenseSchema
from services.base_service import BaseService

expense_schema = ExpenseSchema()
expenses_schema = ExpenseSchema(many=True)

class ExpenseTrackingService(BaseService):
    @staticmethod
    def create_expense(data):
        return BaseService.create_record(Expense, expense_schema, data)

    @staticmethod
    def get_expenses():
        return BaseService.get_records(Expense, expenses_schema)

    @staticmethod
    def get_expense(expense_id):
        return BaseService.get_record(Expense, expense_schema, expense_id)

    @staticmethod
    def update_expense(expense_id, data):
        return BaseService.update_record(Expense, expense_schema, expense_id, data)

    @staticmethod
    def delete_expense(expense_id):
        return BaseService.delete_record(Expense, expense_id)