from enum import Enum

class IncomeFrequency(Enum):
    monthly = 'monthly'
    annually = 'annually'
    bi_weekly = 'bi_weekly'
    weekly = 'weekly'
    daily = 'daily'

class ExpenseFrequency(Enum):
    monthly = 'monthly'
    one_time = 'one_time'
    annually = 'annually'
    bi_weekly = 'bi_weekly'
    weekly = 'weekly'
    daily = 'daily'
