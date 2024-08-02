from flask_jwt_extended import get_jwt_identity, jwt_required
from models import Goal, db
from schemas import GoalSchema
from werkzeug.exceptions import BadRequest, NotFound
from flask import jsonify
import logging

goal_schema = GoalSchema()
goals_schema = GoalSchema(many=True)

class GoalService:

    @staticmethod
    @jwt_required()
    def create_goal(goal_data):
        user_id = get_jwt_identity()
        errors = goal_schema.validate(goal_data)
        if errors:
            logging.error(f"Validation errors while creating goal: {errors}")
            raise BadRequest(errors)

        goal = Goal(
            user_id=user_id,
            name=goal_data['name'],
            description=goal_data.get('description'),
            target_amount=goal_data['target_amount'],
            start_date=goal_data['start_date'],
            end_date=goal_data['end_date']
        )
        db.session.add(goal)
        db.session.commit()
        logging.info(f"Goal created successfully: {goal}")

        return goal_schema.dump(goal)

    @staticmethod
    @jwt_required()
    def get_goals():
        user_id = get_jwt_identity()
        goals = Goal.query.filter_by(user_id=user_id).all()
        logging.info(f"Retrieved goals for user {user_id}: {goals}")
        return goals_schema.dump(goals)

    @staticmethod
    @jwt_required()
    def get_goal(goal_id):
        user_id = get_jwt_identity()
        goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
        if not goal:
            logging.error(f"Goal not found: {goal_id} for user {user_id}")
            raise NotFound('Goal not found')
        logging.info(f"Retrieved goal: {goal}")
        return goal_schema.dump(goal)

    @staticmethod
    @jwt_required()
    def update_goal(goal_id, goal_data):
        user_id = get_jwt_identity()
        goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
        if not goal:
            logging.error(f"Goal not found: {goal_id} for user {user_id}")
            raise NotFound('Goal not found')

        errors = goal_schema.validate(goal_data)
        if errors:
            logging.error(f"Validation errors while updating goal: {errors}")
            raise BadRequest(errors)

        goal.name = goal_data.get('name', goal.name)
        goal.description = goal_data.get('description', goal.description)
        goal.target_amount = goal_data.get('target_amount', goal.target_amount)
        goal.start_date = goal_data.get('start_date', goal.start_date)
        goal.end_date = goal_data.get('end_date', goal.end_date)

        db.session.commit()
        logging.info(f"Goal updated successfully: {goal}")

        return goal_schema.dump(goal)

    @staticmethod
    @jwt_required()
    def delete_goal(goal_id):
        user_id = get_jwt_identity()
        goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
        if not goal:
            logging.error(f"Goal not found: {goal_id} for user {user_id}")
            raise NotFound('Goal not found')

        db.session.delete(goal)
        db.session.commit()
        logging.info(f"Goal deleted successfully: {goal_id}")

        return jsonify({'message': 'Goal deleted successfully'})

    @staticmethod
    @jwt_required()
    def goal_guidance():
        user_id = get_jwt_identity()
        goals = Goal.query.filter_by(user_id=user_id).all()
        if not goals:
            logging.error(f"No goals found for guidance for user {user_id}")
            raise NotFound('No goals found for guidance')

        context = "\n".join([f"Goal: {goal.name} - Target Amount: ${goal.target_amount} - Current Amount: ${goal.current_amount}" for goal in goals])
        response = client.inference(context=context, prompt="goal_guidance")
        logging.info(f"Goal guidance response: {response}")
        return jsonify(response)