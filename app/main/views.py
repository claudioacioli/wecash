from . import main as app_main
from flask import render_template
from flask_login import login_required


@app_main.route("/")
def main():
    return render_template("login.html")


@app_main.route("/invoices")
@login_required
def invoices():
    return render_template("movimentos.html")


@app_main.route("/categories")
@login_required
def categories():
    return render_template("categories.html")


@app_main.route("/banks")
@login_required
def banks():
    return render_template("banks.html")
