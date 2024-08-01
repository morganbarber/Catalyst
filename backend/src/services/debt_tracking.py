from flask import Blueprint, request, jsonify
from schemas import DebtSchema, RepaymentPlanSchema

debt_bp = Blueprint('debt', __name__, url_prefix='/debt')

