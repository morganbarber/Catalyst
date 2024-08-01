import os
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required
from flask_sqlalchemy import SQLAlchemy
from config import DevelopmentConfig, TestingConfig, ProductionConfig
from models import User
from blueprints import expense_bp, auth_bp, income_bp, llm_bp

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
        initializes the SQLAlchemy database and JWTManager, and registers blueprints.

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
    app.register_blueprint(llm_bp, url_prefix='/llm')

    #  Error Handling for JWT
    @jwt.unauthorized_loader
    def handle_unauthorized(e=None):
        return jsonify({'error': 'Authorization required'}), 401

    @jwt.expired_token_loader
    def handle_expired_token(e=None, exp=None):
        return jsonify({'error': 'Token has expired'}), 401

    @jwt.invalid_token_loader
    def handle_invalid_token(e=None):
        return jsonify({'error': 'Invalid token'}), 401
    
    @app.errorhandler(404)
    def not_found(error=None):
        return make_response(jsonify({'error': '404 Not found'}), 404)
    
    @app.errorhandler(500)
    def internal_server_error(error):
        return make_response(jsonify({'error': 'Internal server error'}), 500)
    
    @app.errorhandler(400)
    def bad_request(error):
        return make_response(jsonify({'error': 'Bad request'}), 400)
    
    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=80, host="0.0.0.0")
