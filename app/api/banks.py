from flask import jsonify, request, url_for, current_app
from . import api as app_api, result
from .errors import page_not_found
from .decorators import auth_required
from .. import db
from ..models import Bank


@app_api.route('/banks/', methods=['GET'])
@auth_required()
def read_banks(auth_user):
    user_id = auth_user.get('id')
    banks = Bank.query.filter_by(
            user_id=user_id, 
            type=current_app.config.get('TYPE_DEBIT')
            ).all()
    payload = [bank.to_json() for bank in banks]
    return jsonify(result(payload))


@app_api.route('/banks/<int:id>', methods=['GET'])
@auth_required()
def read_bank(auth_user, id):
    user_id = auth_user.get('id')
    bank = Bank.query.filter_by(
            user_id=user_id, 
            id=id, 
            type=current_app.config.get('TYPE_DEBIT')
            ).first()
    
    if bank is None:
        return page_not_found()

    payload = bank.to_json()
    return jsonify(result(payload))


@app_api.route('/banks/', methods=['POST'])
@auth_required()
def create_bank(auth_user):
    user_id = auth_user.get('id')
    bank = Bank.from_json(request.json)
    bank.user_id = user_id
    db.session.add(bank)
    db.session.commit()
    payload = bank.to_json()
    return jsonify(result(payload)), 201, {'Location': url_for('api.read_bank', id=bank.id)}


@app_api.route('/banks/<int:id>', methods=['PUT'])
@auth_required()
def update_bank(auth_user, id):
    user_id = auth_user.get('id')
    bank = Bank.query.filter_by(user_id=user_id, id=id).first()
    
    if bank is None:
        return page_not_found()

    bank.name = request.json.get('bank', bank.name)
    db.session.add(bank)
    db.session.commit()
    payload = bank.to_json()
    return jsonify(result(payload))


@app_api.route('/banks/<int:id>', methods=['DELETE'])
@auth_required()
def delete_bank(auth_user, id):
    user_id = auth_user.get('id')
    bank = Bank.query.filter_by(user_id=user_id, id=id).first()
    
    if bank is None:
        return page_not_found()

    db.session.delete(bank)
    db.session.commit()
    return jsonify(result(payload={})), 202

