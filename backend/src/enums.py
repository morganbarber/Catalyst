from enum import Enum

class IncomeFrequency(Enum):
    monthly = 'monthly'
    one_time = 'one_time'
    annually = 'annually'

class ExpenseFrequency(Enum):
    monthly = 'monthly'
    one_time = 'one_time'
    annually = 'annually'
    bi_weekly = 'bi_weekly'
    weekly = 'weekly'
