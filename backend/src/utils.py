import jwt

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