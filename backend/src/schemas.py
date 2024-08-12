from marshmallow import Schema, fields, validate

from enums import Frequency, RepaymentStatus, RiskProfile

class UserSchema(Schema):
    id = fields.Integer(dump_only=True)
    username = fields.String(required=True, validate=[validate.Length(min=4, max=20), validate.Regexp(r'^[a-zA-Z0-9_]+$')])
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)

    class Meta:
        fields = ("id", "username", "email", "password")

class IncomeSchema(Schema):
    id = fields.Integer(dump_only=True)
    user_id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    amount = fields.Float(required=True)
    description = fields.String()
    frequency = fields.Enum(enum=Frequency, required=True)

    class Meta:
        fields = ("id", "user_id", "name", "amount", "color", "description", "frequency", "date")

class ExpenseSchema(Schema):
    id = fields.Integer(dump_only=True)
    user_id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    description = fields.String()
    frequency = fields.Enum(enum=Frequency, required=True)
    color = fields.String()
    date = fields.Date()
    amount = fields.Float(required=True)

    class Meta:
        fields = ("id", "user_id", "name", "description", "frequency", "color", "date", "amount")

class DebtSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    amount = fields.Float(required=True)
    interest = fields.Float(required=True)
    description = fields.String()
    color = fields.String()
    date = fields.Date()
    due_date = fields.Date()

    class Meta:
        fields = ("id", "name", "amount", "interest", "description", "color", "date", "due_date")

class RepaymentPlanSchema(Schema):
    id = fields.Integer(dump_only=True)
    amount = fields.Float(required=True)
    due_date = fields.Date(required=True)
    status = fields.String()
    payment_date = fields.Date()
    debt_id = fields.Integer(required=True)
    user_id = fields.Integer(required=True)

    class Meta:
        fields = ("id", "amount", "due_date", "status", "payment_date", "debt_id", "user_id")

class InvestmentSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    amount = fields.Float(required=True)
    risk_profile = fields.String(required=True)
    description = fields.String()
    user_id = fields.Integer(dump_only=True)
    portfolio_id = fields.Integer(required=True)

    class Meta:
        fields = ("id", "name", "amount", "description", "user_id", "portfolio_id")

class PortfolioSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    description = fields.String()
    user_id = fields.Integer(dump_only=True)
    investments = fields.Nested(InvestmentSchema, many=True)

    class Meta:
        fields = ("id", "name", "description", "user_id", "investments")

class BudgetSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    total_amount = fields.Float(required=True)
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)
    description = fields.String()
    user_id = fields.Integer(dump_only=True)
    emergency_fund = fields.Float()
    discretionary_spending = fields.Float()
    remaining_budget = fields.Float()
    total_income = fields.Float()
    total_expense = fields.Float()
    total_investment = fields.Float()

    class Meta:
        fields = ("id", "name", "total_amount", "description", "user_id", "emergency_fund", "discretionary_spending", "remaining_budget", "total_income", "total_expense", "total_investment")

class GoalSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    description = fields.String()
    target_amount = fields.Float(required=True)
    current_amount = fields.Float(dump_only=True)
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)
    user_id = fields.Integer(dump_only=True)

    class Meta:
        fields = ("id", "name", "description", "target_amount", "current_amount", "start_date", "end_date", "user_id")

class TaxSchema(Schema):
    id = fields.Integer(dump_only=True)
    year = fields.Integer(required=True)
    amount = fields.Float(required=True)
    description = fields.String()
    optimization_strategy = fields.String()
    user_id = fields.Integer(dump_only=True)

    class Meta:
        fields = ("id", "year", "amount", "description", "optimization_strategy", "user_id")
