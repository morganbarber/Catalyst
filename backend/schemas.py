from marshmallow import Schema, fields, validate

class UserSchema(Schema):
    id = fields.Integer(dump_only=True)
    username = fields.String(required=True, validate=[validate.Length(min=4, max=20), validate.Regexp(r'^[a-zA-Z0-9_]+$')])
    email = fields.Email(required=True)
    password = fields.String(required=True, load_only=True)
    
    class Meta:
        fields = ("id", "username", "email", "password")