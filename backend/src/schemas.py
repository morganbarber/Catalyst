from marshmallow import Schema, fields, validate

from enums import IncomeFrequency, ExpenseFrequency

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
    frequency = fields.Enum(enum=IncomeFrequency, required=True)
    date = fields.Date()

    class Meta:
        fields = ("id", "user_id", "name", "amount", "color", "description", "frequency", "date")

class ExpenseSchema(Schema):
    id = fields.Integer(dump_only=True)
    user_id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    description = fields.String()
    frequency = fields.Enum(enum=ExpenseFrequency, required=True)
    color = fields.String()
    date = fields.Date()
    amount = fields.Float(required=True)

    class Meta:
        fields = ("id", "user_id", "name", "description", "frequency", "color", "date", "amount")
