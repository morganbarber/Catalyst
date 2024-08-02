from models import Income, db
from schemas import IncomeSchema
from services.base_service import BaseService

income_schema = IncomeSchema()
incomes_schema = IncomeSchema(many=True)

class IncomeTrackingService(BaseService):
    @staticmethod
    def create_income(data):
        return BaseService.create_record(Income, income_schema, data)

    @staticmethod
    def get_incomes():
        return BaseService.get_records(Income, incomes_schema)

    @staticmethod
    def get_income(income_id):
        return BaseService.get_record(Income, income_schema, income_id)

    @staticmethod
    def update_income(income_id, data):
        return BaseService.update_record(Income, income_schema, income_id, data)

    @staticmethod
    def delete_income(income_id):
        return BaseService.delete_record(Income, income_id)