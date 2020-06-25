from flask import jsonify, request, url_for
from . import api as app_api, result
from .errors import page_not_found
from .decorators import auth_required
from .. import db
from ..models import Category


@app_api.route('/categories/', methods=['GET'])
@auth_required()
def read_categories(auth_user):
    user_id = auth_user.get('id')
    categories = Category.query.filter_by(user_id=user_id).all()
    payload = [category.to_json() for category in categories]
    return jsonify(result(payload))


@app_api.route('/categories/<int:id>', methods=['GET'])
@auth_required()
def read_category(auth_user, id):
    
    user_id = auth_user.get('id')
    category = Category.query.filter_by(id=id, user_id=user_id).first()

    if category is None:
        return page_not_found()

    payload = category.to_json()
    return jsonify(result(payload))


@app_api.route('/categories/', methods=['POST'])
@auth_required()
def create_category(auth_user):
    
    category = Category.from_json(request.json)
    category.user_id = auth_user.get('id')

    db.session.add(category)
    db.session.commit()

    location = url_for('api.read_category', id=category.id)
    payload = result(category.to_json())

    return jsonify(payload), 201, {'Location': location}


@app_api.route('/categories/<int:id>', methods=['PUT'])
@auth_required()
def update_category(auth_user, id):
    user_id = auth_user.get('id')
    category = Category.query.filter_by(id=id, user_id=user_id).first()

    if category is None:
        return page_not_found()

    category.name = request.json.get('category', category.name)
    category.type = request.json.get('type', category.type)
    category.go = request.json.get('go', category.go)
    
    db.session.add(category)
    db.session.commit()
    payload = category.to_json()
    
    return jsonify(result(payload))


@app_api.route('/categories/<int:id>', methods=['DELETE'])
@auth_required()
def delete_category(auth_user, id):
    
    user_id = auth_user.get('id')
    category = Category.query.filter_by(id=id, user_id=user_id).first()

    if category is None:
        return page_not_found()
    
    db.session.delete(category)
    db.session.commit()
    return jsonify(result(payload={})), 202

