from marshmallow import Schema, fields

class TaxSchema(Schema):
    id = fields.Integer(dump_only=True)
    year = fields.Integer(required=True)
    amount = fields.Float(required=True)
    description = fields.String()
    optimization_strategy = fields.String()
    user_id = fields.Integer(dump_only=True)

    class Meta:
        fields = ("id", "year", "amount", "description", "optimization_strategy", "user_id")