from services.expense_tracking import ExpenseTrackingService
from services.income_tracking import IncomeTrackingService

class Services:
    def __init__(self, client):
        self.client = client

    def score_finances(self, sub=False):
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

        if sub == True:
            return context

        response = self.client.inference(context=context, prompt="score_finances")

        try:
            assert response[0]["score"]
            assert response[0]["reason"]
        except AssertionError:
            while True:
                response = self.client.inference(context=context, prompt="score_finances")
                try:
                    assert response[0]["score"]
                    assert response[0]["reason"]
                    break
                except AssertionError:
                    continue

        return response

    def chat(self, data):
        messages = data["messages"]
        commands = data["commands"]

        if len(commands) > 0:
            for command in commands:
                if command == "finances":
                    context += self.score_finances(sub=True)
                    

        context = "\n".join([f"{message['sender']}: {message['content']}" + "\n" for message in messages])

        response = self.client.inference(context=context, prompt="chat")

        try:
            assert response
        except AssertionError:
            while True:
                response = self.client.inference(context=context, prompt="chat")
                try:
                    assert response
                    break
                except AssertionError:
                    continue

        if "commands" in response[0]:
            if response[0]["commands"] > 0:
                return self.chat({"messages": response[0]["messages"], "commands": response[0]["commands"]})
        if response[0]["commands"] > 0:
            return self.chat({"messages": response[0]["messages"], "commands": response[0]["commands"]})
        else:
            return response
