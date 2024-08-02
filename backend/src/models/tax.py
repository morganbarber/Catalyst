from datetime import date
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Tax(db.Model):
    __tablename__ = 'tax'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, unique=True)
    year = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    optimization_strategy = db.Column(db.Text)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def __repr__(self):
        return f'<Tax {self.year} - {self.amount}>'