from . import api as app_api, result
from flask import jsonify


@app_api.route("/invocies/")
def invoices():
    return jsonify(result({"invoices": []})), 200


@app_api.route("/categories/")
def categories():
    return jsonify(result({"categories": []})), 200


@app_api.route("/banks/")
def banks():
    return jsonify(result({"banks":[]})), 200

