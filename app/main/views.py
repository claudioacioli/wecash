from . import main as app_main
from flask import render_template


@app_main.route("/")
def main():
    return render_template("login.html")


@app_main.route("/movimentos")
def movimentos():
    return render_template("movimentos.html")


@app_main.route("/categorias")
def categorias():
    return render_template("categorias.html")


@app_main.route("/contas")
def contas():
    return render_template("contas.html")
