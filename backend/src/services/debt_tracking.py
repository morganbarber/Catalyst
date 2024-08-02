from flask_jwt_extended import get_jwt_identity, jwt_required
from models import Debt, RepaymentPlan, db
from schemas import DebtSchema, RepaymentPlanSchema
from werkzeug.exceptions import BadRequest, NotFound
from flask import jsonify
from llm.client import client

debt_schema = DebtSchema()
debts_schema = DebtSchema(many=True)
repayment_plan_schema = RepaymentPlanSchema()
repayment_plans_schema = RepaymentPlanSchema(many=True)

class DebtTrackingService:

    @staticmethod
    @jwt_required()
    def create_debt(debt_data):
        user_id = get_jwt_identity()
        errors = debt_schema.validate(debt_data)
        if errors:
            raise BadRequest(errors)

        debt = Debt(
            user_id=user_id,
            name=debt_data['name'],
            amount=debt_data['amount'],
            interest=debt_data['interest'],
            description=debt_data.get('description'),
            color=debt_data.get('color'),
            date=debt_data.get('date'),
            due_date=debt_data.get('due_date')
        )
        db.session.add(debt)
        db.session.commit()

        return debt_schema.dump(debt)

    @staticmethod
    @jwt_required()
    def get_debts():
        user_id = get_jwt_identity()
        debts = Debt.query.filter_by(user_id=user_id).all()
        return debts_schema.dump(debts)

    @staticmethod
    @jwt_required()
    def get_debt(debt_id):
        user_id = get_jwt_identity()
        debt = Debt.query.filter_by(id=debt_id, user_id=user_id).first()
        if not debt:
            raise NotFound('Debt not found')
        return debt_schema.dump(debt)

    @staticmethod
    @jwt_required()
    def update_debt(debt_id, debt_data):
        user_id = get_jwt_identity()
        debt = Debt.query.filter_by(id=debt_id, user_id=user_id).first()
        if not debt:
            raise NotFound('Debt not found')

        errors = debt_schema.validate(debt_data)
        if errors:
            raise BadRequest(errors)

        debt.name = debt_data.get('name', debt.name)
        debt.amount = debt_data.get('amount', debt.amount)
        debt.interest = debt_data.get('interest', debt.interest)
        debt.description = debt_data.get('description', debt.description)
        debt.color = debt_data.get('color', debt.color)
        debt.date = debt_data.get('date', debt.date)
        debt.due_date = debt_data.get('due_date', debt.due_date)

        db.session.commit()

        return debt_schema.dump(debt)

    @staticmethod
    @jwt_required()
    def delete_debt(debt_id):
        user_id = get_jwt_identity()
        debt = Debt.query.filter_by(id=debt_id, user_id=user_id).first()
        if not debt:
            raise NotFound('Debt not found')

        db.session.delete(debt)
        db.session.commit()

        return jsonify({'message': 'Debt deleted successfully'})

    @staticmethod
    @jwt_required()
    def analyze_repayment():
        user_id = get_jwt_identity()
        debts = Debt.query.filter_by(user_id=user_id).all()
        if not debts:
            raise NotFound('No debts found for analysis')

        context = "\n".join([f"Debt: {debt.name} - Amount: ${debt.amount} - Interest: {debt.interest}" for debt in debts])
        response = client.inference(context=context, prompt="repayment_analysis")
        return jsonify(response)

    @staticmethod
    @jwt_required()
    def debt_consolidation():
        user_id = get_jwt_identity()
        debts = Debt.query.filter_by(user_id=user_id).all()
        if not debts:
            raise NotFound('No debts found for consolidation')

        context = "\n".join([f"Debt: {debt.name} - Amount: ${debt.amount} - Interest: {debt.interest}" for debt in debts])
        response = client.inference(context=context, prompt="debt_consolidation")
        return jsonify(response)

class RepaymentPlanService:

    @staticmethod
    @jwt_required()
    def create_repayment_plan(plan_data):
        user_id = get_jwt_identity()
        errors = repayment_plan_schema.validate(plan_data)
        if errors:
            raise BadRequest(errors)

        plan = RepaymentPlan(
            user_id=user_id,
            amount=plan_data['amount'],
            due_date=plan_data['due_date'],
            status=plan_data.get('status', 'pending'),
            payment_date=plan_data.get('payment_date'),
            debt_id=plan_data['debt_id']
        )
        db.session.add(plan)
        db.session.commit()

        return repayment_plan_schema.dump(plan)

    @staticmethod
    @jwt_required()
    def get_repayment_plans():
        user_id = get_jwt_identity()
        plans = RepaymentPlan.query.filter_by(user_id=user_id).all()
        return repayment_plans_schema.dump(plans)

    @staticmethod
    @jwt_required()
    def get_repayment_plan(plan_id):
        user_id = get_jwt_identity()
        plan = RepaymentPlan.query.filter_by(id=plan_id, user_id=user_id).first()
        if not plan:
            raise NotFound('Repayment plan not found')
        return repayment_plan_schema.dump(plan)

    @staticmethod
    @jwt_required()
    def update_repayment_plan(plan_id, plan_data):
        user_id = get_jwt_identity()
        plan = RepaymentPlan.query.filter_by(id=plan_id, user_id=user_id).first()
        if not plan:
            raise NotFound('Repayment plan not found')

        errors = repayment_plan_schema.validate(plan_data)
        if errors:
            raise BadRequest(errors)

        plan.amount = plan_data.get('amount', plan.amount)
        plan.due_date = plan_data.get('due_date', plan.due_date)
        plan.status = plan_data.get('status', plan.status)
        plan.payment_date = plan_data.get('payment_date', plan.payment_date)
        plan.debt_id = plan_data.get('debt_id', plan.debt_id)

        db.session.commit()

        return repayment_plan_schema.dump(plan)

    @staticmethod
    @jwt_required()
    def delete_repayment_plan(plan_id):
        user_id = get_jwt_identity()
        plan = RepaymentPlan.query.filter_by(id=plan_id, user_id=user_id).first()
        if not plan:
            raise NotFound('Repayment plan not found')

        db.session.delete(plan)
        db.session.commit()

        return jsonify({'message': 'Repayment plan deleted successfully'})

    @staticmethod
    @jwt_required()
    def optimize_repayment():
        user_id = get_jwt_identity()
        plans = RepaymentPlan.query.filter_by(user_id=user_id).all()
        if not plans:
            raise NotFound('No repayment plans found for optimization')

        context = "\n".join([f"Repayment Plan: {plan.id} - Amount: ${plan.amount} - Due Date: {plan.due_date}" for plan in plans])
        response = client.inference(context=context, prompt="repayment_optimization")
        return jsonify(response)