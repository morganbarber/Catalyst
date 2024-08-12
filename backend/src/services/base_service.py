from flask_jwt_extended import get_jwt_identity, jwt_required
from werkzeug.exceptions import BadRequest, NotFound
from flask import jsonify
from models import db

class BaseService:
    @staticmethod
    @jwt_required()
    def create_record(model, schema, data):
        user_id = get_jwt_identity()
        errors = schema.validate(data)
        if errors:
            raise BadRequest(errors)

        record = model(user_id=user_id, **data)
        db.session.add(record)
        db.session.commit()

        return schema.dump(record)

    @staticmethod
    @jwt_required()
    def get_records(model, schema):
        user_id = get_jwt_identity()
        records = model.query.filter_by(user_id=user_id).all()
        return schema.dump(records, many=True)

    @staticmethod
    @jwt_required()
    def get_record(model, schema, record_id):
        user_id = get_jwt_identity()
        record = model.query.filter_by(id=record_id, user_id=user_id).first()
        if not record:
            raise NotFound(f'{model.__name__} not found')
        return schema.dump(record)

    @staticmethod
    @jwt_required()
    def update_record(model, schema, record_id, data):
        user_id = get_jwt_identity()
        record = model.query.filter_by(id=record_id, user_id=user_id).first()
        if not record:
            raise NotFound(f'{model.__name__} not found')

        for key, value in data.items():
            if value is not None:
                setattr(record, key, value)

        db.session.commit()

        return schema.dump(record)

    @staticmethod
    @jwt_required()
    def delete_record(model, record_id):
        user_id = get_jwt_identity()
        record = model.query.filter_by(id=record_id, user_id=user_id).first()
        if not record:
            raise NotFound(f'{model.__name__} not found')

        db.session.delete(record)
        db.session.commit()

        return jsonify({'message': f'{model.__name__} deleted successfully'})
