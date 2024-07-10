# Just database API!!!

from flask import Blueprint, request, jsonify
from models import Item, get_db
from security import is_allowed_ip, MAX_ITEMS

api_blueprint = Blueprint("api", __name__)

@api_blueprint.route("/items", methods=["GET"])
def get_all_items():
    if not is_allowed_ip():
        return jsonify({"message": "Unauthorized access"}), 401

    with get_db() as db:
        items = db.query(Item).limit(MAX_ITEMS).all()
        return jsonify([item.__dict__ for item in items])

@api_blueprint.route("/items/<int:item_id>", methods=["GET"])
def get_item(item_id):
    if not is_allowed_ip():
        return jsonify({"message": "Unauthorized access"}), 401

    with get_db() as db:
        item = db.query(Item).filter(Item.id == item_id).first()
        if item:
            return jsonify(item.__dict__)
        else:
            return jsonify({"message": "Item not found"}), 404

@api_blueprint.route("/items", methods=["POST"])
def create_item():
    if not is_allowed_ip():
        return jsonify({"message": "Unauthorized access"}), 401

    data = request.get_json()
    if not data or not all(key in data for key in ["name"]):
        return jsonify({"message": "Invalid request data"}), 400

    with get_db() as db:
        item = Item(**data)
        db.add(item)
        db.commit()
        return jsonify(item.__dict__), 201

@api_blueprint.route("/items/<int:item_id>", methods=["PUT"])
def update_item(item_id):
    if not is_allowed_ip():
        return jsonify({"message": "Unauthorized access"}), 401

    data = request.get_json()
    with get_db() as db:
        item = db.query(Item).filter(Item.id == item_id).first()
        if item:
            item.name = data.get("name", item.name)
            item.description = data.get("description", item.description)
            db.commit()
            return jsonify({"message": "Item updated"}), 200
        else:
            return jsonify({"message": "Item not found"}), 404

@api_blueprint.route("/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id):
    if not is_allowed_ip():
        return jsonify({"message": "Unauthorized access"}), 401

    with get_db() as db:
        item = db.query(Item).filter(Item.id == item_id).first()
        if item:
            db.delete(item)
            db.commit()
            return jsonify({"message": "Item deleted"}), 200
        else:
            return jsonify({"message": "Item not found"}), 404