from . import api as app_api
from flask import jsonify


@app_api.route("/movimentos")
def movimentos():
    return result_success([])


@app_api.route("/categorias")
def categorias():
    return result_success([])


@app_api.route("/contas")
def contas():
    return result_success([])


def result_success(payload, status=1, message="OK", http_status=200):
    return jsonify({"status": status,
            "message": message,
            "payload": payload}), http_status
