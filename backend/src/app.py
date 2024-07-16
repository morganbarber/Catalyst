import os
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required
from flask_sqlalchemy import SQLAlchemy
from config import DevelopmentConfig, TestingConfig, ProductionConfig
from models import User
from blueprints import expense_bp, auth_bp, income_bp

from models import db
jwt = JWTManager()

def create_app(config_class=DevelopmentConfig):
    """
    Creates a Flask application with the specified configuration class.

    Args:
        config_class (class, optional): The configuration class to use. Defaults to DevelopmentConfig.

    Returns:
        Flask: The Flask application instance.

    Description:
        This function creates a Flask application with the specified configuration class. It initializes the Flask
        application and configures it with the specified configuration class. It also enables CORS for all origins,
        initializes the SQLAlchemy database and JWTManager, and defines the routes for the signup, login, and refresh
        endpoints. The function also sets up error handling for JWT.

        The signup endpoint handles the signup process by receiving user data from the request, calling the
        AuthService.signup method, and returning the response as JSON with a status code of 201. If a BadRequest
        exception is raised, it returns an error response with a status code of 400. If any other exception is raised,
        it returns an internal server error response with a status code of 500.

        The login endpoint handles the login process by receiving user data from the request, calling the
        AuthService.login method, and returning the response as JSON with a status code of 200. If an Unauthorized
        exception is raised, it returns an error response with a status code of 401. If a BadRequest exception is
        raised, it returns an error response with a status code of 400. If any other exception is raised, it returns
        an internal server error response with a status code of 500.

        The refresh endpoint handles the token refresh process by calling the AuthService.refresh_token method and
        returning the response as JSON with a status code of 200. If an Unauthorized exception is raised, it returns an
        error response with a status code of 401. If any other exception is raised, it returns an internal server
        error response with a status code of 500.

        The function also sets up error handling for JWT. The @jwt.unauthorized_loader decorator defines a handler
        for unauthorized requests, returning an error response with a status code of 401. The @jwt.expired_token_loader
        decorator defines a handler for expired tokens, returning an error response with a status code of 401. The
        @jwt.invalid_token_loader decorator defines a handler for invalid tokens, returning an error response with a
        status code of 401.

        The function returns the Flask application instance.
    """
    app = Flask(__name__)
    app.config.from_object(config_class)

    #  Enable CORS for all origins
    CORS(app)

    db.init_app(app)
    jwt.init_app(app)

    # we can change directory structure later
    app.register_blueprint(auth_bp, url_prefix='/')
    app.register_blueprint(expense_bp, url_prefix='/')
    app.register_blueprint(income_bp, url_prefix='/')

    #  Error Handling for JWT
    @jwt.unauthorized_loader
    def handle_unauthorized():
        return jsonify({'error': 'Authorization required'}), 401

    @jwt.expired_token_loader
    def handle_expired_token():
        return jsonify({'error': 'Token has expired'}), 401

    @jwt.invalid_token_loader
    def handle_invalid_token():
        return jsonify({'error': 'Invalid token'}), 401

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=8081)
