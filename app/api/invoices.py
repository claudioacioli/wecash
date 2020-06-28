from datetime import datetime
from calendar import monthrange
from flask import jsonify, request, url_for
from . import api as app_api, result
from .errors import page_not_found
from .decorators import auth_required
from .. import db
from ..models import Invoice


@app_api.route('/invoices/', methods=['GET'])
@auth_required()
def read_invoices(auth_user):
    user_id = auth_user.get('id')
    invoices = Invoice.query.filter_by(user_id=user_id).all()
    payload = [invoice.to_json() for invoice in invoices]
    return jsonify(result(payload))


@app_api.route('/invoices/<int:id>', methods=['GET'])
@auth_required()
def read_invoice(auth_user, id):
    user_id = auth_user.get('id')
    invoice = Invoice.query.filter_by(id=id, user_id=user_id).first()

    if invoice is None:
        return page_not_found()

    payload = invoice.to_json()
    return jsonify(result(payload))


@app_api.route("/invoices/<string:year>/<string:month>")
@auth_required()
def read_invoices_by_ref(user, year, month):
    
    user_id = user.get("id")

    week_first_day, last_day = monthrange(int(year),int(month))
    start = '-'.join((year, month, '01'))
    end = '-'.join((year, month, str(last_day).zfill(2)))

    invoices = Invoice.query_between_dates(user_id, start, end)
    
    #Show pendencies from another month
    today = datetime.today()
    if str(today.year) + str(today.month).zfill(2) == year + month: 
        invoices += Invoice.query_pendencies(user_id)

    payload = [invoice.to_json() for invoice in invoices]
    return jsonify(result(payload)), 200


@app_api.route('/invoices/', methods=['POST'])
@auth_required()
def create_invoice(auth_user):
    
    invoice = Invoice.from_json(request.json)
    invoice.user_id = auth_user.get('id')

    db.session.add(invoice)
    db.session.commit()

    location = url_for('api.read_invoice', id=invoice.id)
    payload = result(invoice.to_json())

    return jsonify(payload), 201, {'Location': location}


@app_api.route('/invoices/<int:id>', methods=['PUT'])
@auth_required()
def update_invoice(auth_user, id):
    user_id = auth_user.get('id')
    invoice = Invoice.query.filter_by(id=id, user_id=user_id).first()

    if invoice is None:
        return page_not_found()

    invoice.history = request.json.get('history', invoice.history)
    invoice.forecast_date = request.json.get('forecast_date', invoice.forecast_date)
    invoice.confirmation_date = request.json.get('confirmation_date', invoice.confirmation_date)
    invoice.expected_value = request.json.get('expected_value', invoice.expected_value)
    invoice.confirmed_value = str(request.json.get('confirmed_value')) or invoice.confirmed_value
    invoice.bank_id = request.json.get('bank_id', invoice.bank_id)
    invoice.category_id = request.json.get('category_id', invoice.category_id)
    
    db.session.add(invoice)
    db.session.commit()
    payload = invoice.to_json()
    
    return jsonify(result(payload))


@app_api.route('/invoices/<int:id>', methods=['DELETE'])
@auth_required()
def delete_invoice(auth_user, id):
    
    user_id = auth_user.get('id')
    invoice = Invoice.query.filter_by(id=id, user_id=user_id).first()

    if invoice is None:
        return page_not_found()
    
    db.session.delete(invoice)
    db.session.commit()
    return jsonify(result(payload={})), 202

