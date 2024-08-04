from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

from enums import Frequency, RepaymentStatus, RiskProfile

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String())
    incomes = db.relationship('Income', backref='user')
    expenses = db.relationship('Expense', backref='user', lazy='dynamic')
    risk_profile = db.Column(db.Enum(RiskProfile), nullable=False)

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
    frequency = db.Column(db.Enum(Frequency), nullable=False)
    color = db.Column(db.String(10))

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Income {self.name} - {self.amount}>'


class Expense(db.Model):
    __tablename__ = 'expense'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    frequency = db.Column(db.Enum(Frequency), nullable=False)
    color = db.Column(db.String(10))
    date = db.Column(db.Date)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Expense {self.name} - {self.amount}>'


class Debt(db.Model):
    __tablename__ = 'debt'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    interest = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    color = db.Column(db.String(10))
    date = db.Column(db.Date)
    due_date = db.Column(db.Date)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Debt {self.name} - {self.amount}>'


class RepaymentPlan(db.Model):
    __tablename__ = 'repayment_plan'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    amount = db.Column(db.Float, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    status = db.Column(db.Enum(RepaymentStatus), default='Pending', nullable=False)
    payment_date = db.Column(db.Date, nullable=True)

    debt_id = db.Column(db.Integer, db.ForeignKey('debt.id'), nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<RepaymentPlan {self.id} - {self.amount} - {self.status}>'


class Investment(db.Model):
    __tablename__ = 'investment'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    name = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    risk_profile = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Investment {self.name} - {self.amount}>'


class Portfolio(db.Model):
    __tablename__ = 'portfolio'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    investments = db.relationship('Investment', backref='portfolio', lazy=True)

    def __repr__(self):
        return f'<Portfolio {self.name}>'


class Budget(db.Model):
    __tablename__ = 'budget'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    name = db.Column(db.String(100), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    description = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Budget {self.name} - {self.total_amount}>'


class Goal(db.Model):
    __tablename__ = 'goal'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    target_amount = db.Column(db.Float, nullable=False)
    current_amount = db.Column(db.Float, default=0.0)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Goal {self.name} - {self.target_amount} - {self.current_amount}>'