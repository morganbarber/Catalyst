import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sqlalchemy import SQLAlchemy
from .config import DevelopmentConfig, TestingConfig, ProductionConfig
from .services import AuthService
from .models import User

db = SQLAlchemy()
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

    @app.route('/auth/signup', methods=['POST'])
    def signup():
        """
        Handles the signup process by receiving user data from the request, calling the AuthService.signup method, and returning the response as JSON with a status code of 201. 
        If a BadRequest exception is raised, it returns an error response with a status code of 400. 
        If any other exception is raised, it returns an internal server error response with a status code of 500.
        """
        try:
            user_data = request.get_json()
            response = AuthService.signup(user_data)
            return jsonify(response), 201
        except BadRequest as e:
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('/auth/login', methods=['POST'])
    def login():
        """
        Endpoint for user login.

        This endpoint handles the login process by receiving user data from the request, calling the AuthService.login
        method, and returning the response as JSON with a status code of 200. If an Unauthorized exception is raised, it
        returns an error response with a status code of 401. If a BadRequest exception is raised, it returns an error
        response with a status code of 400. If any other exception is raised, it returns an internal server error response
        with a status code of 500.

        Parameters:
            None

        Returns:
            Tuple: A tuple containing the JSON response and the HTTP status code.
                - JSON response (dict): The JSON response containing the login result.
                - HTTP status code (int): The HTTP status code indicating the success or failure of the login process.

        Raises:
            Unauthorized: If the user credentials are invalid.
            BadRequest: If the request data is invalid.
            Exception: If any other exception occurs during the login process.
        """
        try:
            user_data = request.get_json()
            response = AuthService.login(user_data)
            return jsonify(response), 200
        except Unauthorized as e:
            return jsonify({'error': str(e)}), 401
        except BadRequest as e:
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            return jsonify({'error': 'Internal server error'}), 500

    @app.route('auth/refresh', methods=['POST'])
    @jwt_required(refresh=True)
    def refresh():
        """
        A route that handles refreshing tokens. Calls AuthService.refresh_token to get a new access token.
        
        Raises:
            Unauthorized: If the user is not authorized.
            Exception: If any other exception occurs.
            
        Returns:
            Tuple: A tuple containing the JSON response and the HTTP status code.
                - JSON response (dict): The JSON response containing the new access token.
                - HTTP status code (int): The HTTP status code indicating the success or failure of the refresh process.
        """
        try:
            response = AuthService.refresh_token()
            return jsonify(response), 200
        except Unauthorized as e:
            return jsonify({'error': str(e)}), 401
        except Exception as e:
            return jsonify({'error': 'Internal server error'}), 500
        
    @app.route('/auth/logout', methods=['POST'])
    @jwt_required()
    def logout():
        """
        A route that handles logging out. Calls AuthService.logout to remove the access and refresh tokens from the
        session.
        
        Raises:
            Unauthorized: If the user is not authorized.
            Exception: If any other exception occurs.
            
        Returns:
            Tuple: A tuple containing the JSON response and the HTTP status code.
                - JSON response (dict): The JSON response containing the success message.
                - HTTP status code (int): The HTTP status code indicating the success or failure of the logout process.
        """
        try:
            response = AuthService.logout()
            return jsonify(response), 200
        except Unauthorized as e:
            return jsonify({'error': str(e)}), 401
        except Exception as e:
            return jsonify({'error': 'Internal server error'}), 500

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
    app.run(debug=True)