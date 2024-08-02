from enum import Enum

class Frequency(Enum):
    monthly = 'monthly'
    one_time = 'one_time'
    annually = 'annually'
    bi_weekly = 'bi_weekly'
    weekly = 'weekly'
    daily = 'daily'

class RepaymentStatus(Enum):
    pending = 'pending'
    completed = 'completed'
    failed = 'failed'