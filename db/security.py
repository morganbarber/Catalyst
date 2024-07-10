import os
from functools import wraps
from flask import request, jsonify
from werkzeug.exceptions import BadRequest
import time

ALLOWED_IPS = ["127.0.0.1", "192.168.1.100"]

MAX_ITEMS = 50

API_KEY = os.environ.get("API_KEY") 

def check_api_key(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if "Authorization" not in request.headers:
            return jsonify({"message": "API key required"}), 401

        api_key = request.headers.get("Authorization")
        if api_key != API_KEY:
            return jsonify({"message": "Invalid API key"}), 401

        return func(*args, **kwargs)
    return wrapper

def is_allowed_ip():
    remote_addr = request.remote_addr
    return remote_addr in ALLOWED_IPS

def sanitize_input(data):
    """
    This function sanitizes and validates input data before processing it.
    :param data: Input data to be sanitized.
    :return: Sanitized input data.
    """
    if isinstance(data, str):
        return data.strip()
    elif isinstance(data, (list, tuple)):
        return [sanitize_input(item) for item in data]
    elif isinstance(data, dict):
        return {key: sanitize_input(value) for key, value in data.items()}
    else:
        raise ValueError("Unsupported data type")

def validate_input(data, expected_keys):
    """
    This function validates input data against a list of expected keys.
    :param data: Input data to be validated.
    :param expected_keys: List of expected keys.
    :return: None if validation fails, else input data.
    """
    if not isinstance(data, dict):
        raise ValueError("Input data must be a dictionary")
    for key in expected_keys:
        if key not in data:
            raise BadRequest(f"Missing required key: {key}")
    return data


def setup_security(app):
    @app.before_request
    @check_api_key
    def authenticate():
        data = request.get_json()
        if data is not None:
            data = validate_input(
                sanitize_input(data),
                ["id"]
            )

    ip_to_requests = {}
    REQUESTS_PER_MINUTE = 10
    REQUESTS_PER_MINUTE_LIMIT = REQUESTS_PER_MINUTE * 60
    REQUESTS_PER_MINUTE_TIME = 60

    @app.before_request
    def rate_limit():
        data = request.get_json()
        if data is not None:
            data = validate_input(
                sanitize_input(data),
                ["id"]
            )

        ip_address = request.remote_addr
        if ip_address not in ip_to_requests:
            ip_to_requests[ip_address] = []

        ip_to_requests[ip_address].append(time.time())

        while len(ip_to_requests[ip_address]) > REQUESTS_PER_MINUTE:
            oldest_request_time = ip_to_requests[ip_address][0]
            if time.time() - oldest_request_time > REQUESTS_PER_MINUTE_TIME:
                ip_to_requests[ip_address] = ip_to_requests[ip_address][1:]
            else:
                return jsonify({"message": "Too many requests"}), 429

        if not is_allowed_ip():
            return jsonify({"message": "Too many requests"}), 429
