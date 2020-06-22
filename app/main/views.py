from . import main as app_main
from flask import render_template


@app_main.route("/")
def main():
    return render_template("login.html")


@app_main.route("/invoices")
def invoices():
    return render_template("movimentos.html")


@app_main.route("/categories")
def categories():
    return render_template("categories.html")


@app_main.route("/banks")
def banks():
    return render_template("banks.html")
