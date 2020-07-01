from datetime import datetime
from calendar import monthrange
from flask import jsonify, request, url_for
from . import api as app_api, result
from .errors import page_not_found
from .decorators import auth_required
from .. import db
from ..models.invoice import Invoice


@app_api.route("/overview/<string:year>/<string:month>")
@auth_required()
def read_overview_by_ref(user, year, month):
    
    user_id = user.get("id")

    week_first_day, last_day = monthrange(int(year),int(month))
    start = '-'.join((year, month, '01'))
    end = '-'.join((year, month, str(last_day).zfill(2)))

    invoices = Invoice.query_between_dates(user_id, start, end)
    
    #Show pendencies from another month
    today = datetime.today()
    if str(today.year) + str(today.month).zfill(2) == year + month: 
        invoices += Invoice.query_pendencies(user_id)

    despesa = 0
    receita = 0
    fatura = 0
    for invoice in invoices:
        json_invoices = invoice.to_json()
        type_of_bank = json_invoices.get('bank').get('type')
        type_of_category = json_invoices.get('category').get('type')

        if type_of_bank == 'D' and type_of_category == 'D':
            despesa += invoice.expected_value

        if type_of_bank == 'D' and type_of_category == 'R':
            receita += invoice.expected_value

        if type_of_bank == 'C':
            fatura += invoice.expected_value

    return jsonify(result({
        'despesa': despesa,
        'receita': receita,
        'fatura': fatura
        })), 200

