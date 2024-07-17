from flask import current_app
from models import User, db
from schemas import UserSchema
from utils import generate_password_hash, generate_token
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity
from werkzeug.exceptions import BadRequest, Unauthorized

user_schema = UserSchema()
users_schema = UserSchema(many=True)

class AuthService:

    @staticmethod
    def Signup(user_data):
        """Registers a new user.

        Args:
            user_data (dict): User data from the request.

        Returns:
            dict: User data with access and refresh tokens.
        """
        errors = user_schema.validate(user_data)
        if errors:
            raise BadRequest(errors)

        existing_user = User.query.filter_by(email=user_data['email']).first()
        if existing_user:
            raise BadRequest('Email already exists')

        user = User(
            username=user_data['username'],
            email=user_data['email'],
            password=generate_password_hash(user_data['password'])
        )
        db.session.add(user)
        db.session.commit()

        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return {
            "user": user_schema.dump(user),
            "access_token": access_token,
            "refresh_token": refresh_token
        }

    @staticmethod
    def Login(user_data):
        """Logs in an existing user.

        Args:
            user_data (dict): User data from the request.

        Returns:
            dict: User data with access and refresh tokens.
        """
        errors = user_schema.validate(user_data)
        if errors:
            raise BadRequest(errors)

        user = User.query.filter_by(email=user_data['email']).first()
        if not user or not user.check_password(user_data['password']):
            raise Unauthorized('Invalid credentials')

        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        return {
            "user": user_schema.dump(user),
            "access_token": access_token,
            "refresh_token": refresh_token
        }

    @staticmethod
    def Refresh_token():
        """Refreshes an access token.

        Returns:
            dict: New access token.
        """
        user_id = get_jwt_identity()
        if not user_id:
            raise Unauthorized('Missing authorization header')

        access_token = create_access_token(identity=user_id)
        return {"access_token": access_token}
    
    @staticmethod
    def Validate_token(token):
        return current_app.jinja_env.globals['validate_token'](token)
    
    @staticmethod
    def Logout(token):
        return current_app.jinja_env.globals['logout'](token)