from werkzeug.security import generate_password_hash

def generate_password_hash(password):
    """Hashes a password using a secure algorithm.

    Args:
        password (str): The password to hash.

    Returns:
        str: The hashed password.
    """
    return generate_password_hash(password)

def generate_token(data, secret_key, expires_in):
    """Generates a JSON Web Token (JWT).

    Args:
        data (dict): Data to be encoded in the JWT payload.
        secret_key (str): The secret key used for signing the JWT.
        expires_in (int): The number of seconds the JWT is valid for.

    Returns:
        str: The generated JWT.
    """
    return jwt.encode(data, secret_key, algorithm='HS256').decode('utf-8')