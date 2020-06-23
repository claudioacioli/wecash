from flask import jsonify, request, url_for
from . import api as app_api, result
from .. import db
from ..models import Bank


@app_api.route('/banks/', methods=['GET'])
def read_banks():
    banks = Bank.query.all()
    payload = [bank.to_json() for bank in banks]
    return jsonify(result(payload))


@app_api.route('/banks/<int:id>', methods=['GET'])
def read_bank(id):
    bank = Bank.query.get_or_404(id)
    payload = bank.to_json()
    return jsonify(result(payload))


@app_api.route('/banks/', methods=['POST'])
def create_bank():
    bank = Bank.from_json(request.json)
    db.session.add(bank)
    db.session.commit()
    payload = bank.to_json()
    return jsonify(result(payload)), 201, {'Location': url_for('api.read_bank', id=bank.id)}


@app_api.route('/banks/<int:id>', methods=['PUT'])
def update_bank(id):
    bank = Bank.query.get_or_404(id)
    bank.name = request.json.get('bank', bank.name)
    db.session.add(bank)
    db.session.commit()
    payload = bank.to_json()
    return jsonify(result(payload))


@app_api.route('/banks/<int:id>', methods=['DELETE'])
def delete_bank(id):
    bank = Bank.query.get_or_404(id)
    db.session.delete(bank)
    db.session.commit()
    return jsonify(result(payload={})), 202

