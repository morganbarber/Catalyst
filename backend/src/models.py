from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import sys

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    def set_password(self, password):
        """
        Set the password for the user.

        Args:
            password (str): The password to be set.

        Returns:
            None
        """
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """
        A function to check if the provided password matches the hashed password.
        
        Args:
            password (str): The password to check against the hashed password.
            
        Returns:
            bool: True if the password matches, False otherwise.
        """
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return '<User %r>' % self.username