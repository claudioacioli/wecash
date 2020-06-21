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
    return jsonify(
            result(
                payload={"user": user.to_json()}
            )
        ), 201
