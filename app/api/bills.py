from calendar import monthrange
from flask import jsonify, request, url_for
from . import api as app_api, result
from .decorators import auth_required
from ..models.invoice import Invoice


@app_api.route("/bills/<string:year>/<string:month>")
@auth_required()
def read_bills_by_ref(user, year, month):
    
    user_id = user.get("id")
    bank_type = "C"

    payload = []
    
    week_first_day, last_day = monthrange(int(year),int(month))
    start = '-'.join((year, month, '01'))
    end = '-'.join((year, month, str(last_day).zfill(2)))
    
    invoices = Invoice.query_between_dates(
            user_id, 
            start, 
            end, 
            bank_type=bank_type)
    payload = [invoice.to_json() for invoice in invoices]

    return jsonify(result(payload)), 200
