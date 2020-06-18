from . import api as app_api
from flask import jsonify


@app_api.route("/movimentos")
def movimentos():
    return result([])


@app_api.route("/categorias")
def categorias():
    return result([])


@app_api.route("/contas")
def contas():
    return result([])


def result(payload, status=1, message="OK", http_status=200):
    return jsonify({"status": status,
            "message": message,
            "payload": payload}), http_status
