from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from services import AuthService
from werkzeug.exceptions import NotFound, BadRequest, Unauthorized

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/auth/signup', methods=['POST'])
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

@auth_bp.route('/auth/login', methods=['POST'])
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

@auth_bp.route('/auth/refresh', methods=['POST'])
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
    
@auth_bp.route('/auth/logout', methods=['POST'])
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
