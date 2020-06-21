from flask import jsonify, request, current_app, url_for
from . import api as app_api
from . import result
from .. import db
from ..models import User


@app_api.route('/users', methods=['POST'])
def create_user():
    user = User.from_json(request.json)
    db.session.add(user)
    db.session.commit()
    payload = {'user': user.to_json()}
    return jsonify(result(payload)), 201


@app_api.route('/users', methods=['GET'])
def read_users():
    users = User.query.all()
    payload = {'users': [user.to_json() for user in users]}
    return jsonify(result(payload))
