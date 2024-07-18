from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    incomes = db.relationship('Income', backref='user')
    expenses = db.relationship('Expense', backref='user', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<User {self.username}>'


class Income(db.Model):
    __tablename__ = 'income'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    frequency = db.Column(db.Enum('monthly', 'one_time', 'annually', name='income_frequency'), nullable=False)
    date = db.Column(db.Date)

    def __repr__(self):
        return f'<Income {self.name} - {self.amount}>'


class Expense(db.Model):
    __tablename__ = 'expense'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    frequency = db.Column(db.Enum('monthly', 'one_time', 'annually', name='expense_frequency'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    color = db.Column(db.String(10))
    date = db.Column(db.Date)

    def __repr__(self):
        return f'<Expense {self.name} - {self.amount}>'