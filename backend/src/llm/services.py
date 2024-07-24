from services.expense_tracking import ExpenseTrackingService
from services.income_tracking import IncomeTrackingService

class Services:
    def __init__(self, client):
        self.client = client

    def score_finances(self):
        income_service = IncomeTrackingService()
        expense_service = ExpenseTrackingService()

        incomes = income_service.get_incomes()
        expenses = expense_service.get_expenses()

        incomes_info = "\n".join([f"Income: {income.name} - Amount: ${income.amount}" for income in incomes])
        expenses_info = "\n".join([f"Expense: {expense.name} - Amount: ${expense.amount}" for expense in expenses])

        total_income = sum([income.amount for income in incomes])
        total_expense = sum([expense.amount for expense in expenses])
        net_income = total_income - total_expense

        context = f"Incomes:\n{incomes_info}\nExpenses:\n{expenses_info}\nTotal Income: ${total_income}\nTotal Expense: ${total_expense}\nNet Income: ${net_income}"

        response = self.client.inference(context=context, prompt="score_finances")

        try:
            assert response[0]["score"]
            assert response[0]["reason"]
        except AssertionError:
            while True:
                response = self.client.inference(context=context, prompt="score_finances")
                try:
                    assert response["json"]["score"]
                    assert response["json"]["reason"]
                    break
                except AssertionError:
                    continue

        return response
