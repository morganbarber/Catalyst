from services.expense_tracking import ExpenseTrackingService
from services.income_tracking import IncomeTrackingService
from services.budget_service import BudgetService
from services.investment_service import InvestmentService
from services.goal_service import GoalService

class Services:
    def __init__(self, client):
        self.client = client

    def score_finances(self, sub=False):
        incomes = IncomeTrackingService.get_incomes()
        expenses = ExpenseTrackingService.get_expenses()
        incomes_info = "\n".join([f"Income: {income['name']} - Amount: ${income['amount']} - Frequency: {income['frequency']}" for income in incomes])
        expenses_info = "\n".join([f"Expense: {expense['name']} - Amount: ${expense['amount']} - Frequency: {expense['frequency']}" for expense in expenses])

        total_income = sum([income['amount'] for income in incomes])
        total_expense = sum([expense['amount'] for expense in expenses])
        net_income = total_income - total_expense

        context = f"Incomes:\n{incomes_info}\nExpenses:\n{expenses_info}\nTotal Income: ${total_income}\nTotal Expense: ${total_expense}\nNet Income: ${net_income}"

        if sub == True:
            return context

        response = self.client.inference(context=context, prompt="score_finances")

        return responses

    def chat(self, data):
        messages = data["messages"]

        context = self.score_finances(sub=True)

        budget = BudgetService.get_budgets().first()
        if budget:
            context += f"\n\nBudget: {budget['name']} - Discretionary Spending: {budget['discretionary_spending']} - Emergency Fund: {budget['emergency_fund']}\n Investment Fund: {budget['investment_fund']} - Goal Fund: {budget['goal_fund']}"

        investments = InvestmentService.get_investments()
        if investments:
            investments_info = "\n".join([f"Investment: {investment['name']} - Amount: {investment['amount']}" for investment in investments])
            context += f"\n\nInvestments:\n{investments_info}"

        context += "\n\n".join([f"{message['sender']}: {message['content']}" + "\n" for message in messages])

        response = self.client.inference(context=context, prompt="chat")

        return response

    def debt_tips(self, debt_data):
        context = "\n".join([f"Debt: {debt['name']} - Amount: {debt['amount']}" for debt in debt_data])
        response = self.client.inference(context=context, prompt="debt_tips")
        return response
