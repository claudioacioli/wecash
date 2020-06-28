from flask import jsonify, request, url_for, current_app
from . import api as app_api, result
from .errors import page_not_found
from .decorators import auth_required
from .. import db
from ..models import Card


@app_api.route('/cards/', methods=['GET'])
@auth_required()
def read_cards(auth_user):
    user_id = auth_user.get('id')
    cards = Card.query.filter_by(
            user_id=user_id, 
            type=current_app.config.get('TYPE_CREDIT')
            ).all()
    payload = [card.to_json() for card in cards]
    return jsonify(result(payload))


@app_api.route('/cards/<int:id>', methods=['GET'])
@auth_required()
def read_card(auth_user, id):
    user_id = auth_user.get('id')
    card = Card.query.filter_by(
            user_id=user_id, 
            id=id, 
            type=current_app.config.get('TYPE_CREDIT')
            ).first()
    
    if card is None:
        return page_not_found()

    payload = card.to_json()
    return jsonify(result(payload))


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

