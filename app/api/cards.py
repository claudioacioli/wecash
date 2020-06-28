from flask import jsonify, request, url_for
from . import api as app_api, result
from .errors import page_not_found
from .decorators import auth_required
from .. import db
from ..models import Card


@app_api.route('/cards/', methods=['POST'])
@auth_required()
def create_card(auth_user):
    user_id = auth_user.get('id')
    card = Card.from_json(request.json)
    card.user_id = user_id
    db.session.add(card)
    db.session.commit()
    payload = card.to_json()
    return jsonify(result(payload)), 201
    #return jsonify(result(payload)), 201, {'Location': url_for('api.read_bank', id=bank.id)}

