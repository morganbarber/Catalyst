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
    incomes = db.relationship('Income', backref='user', lazy='dynamic')
    expenses = db.relationship('Expense', backref='user', lazy='dynamic')

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
    
class Income(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    frequency = db.Column(db.Enum('monthly', 'one_time', 'annually', name='income_frequency'), nullable=False)
    date = db.Column(db.Date)
    user = db.relationship('User', backref=db.backref('incomes', lazy=True))

    def __repr__(self):
        return f'<Income {self.name} - {self.amount}>'

class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    frequency = db.Column(db.Enum('monthly', 'one_time', 'annually', name='expense_frequency'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(10))
    date = db.Column(db.Date)
    user = db.relationship('User', backref=db.backref('expenses', lazy=True))

    def __repr__(self):
        return f'<Expense {self.name} - {self.amount}>'