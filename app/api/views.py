from . import api as app_api, result
from flask import jsonify


@app_api.route("/invoices/")
def invoices():
    return jsonify(result({"invoices": []})), 200



