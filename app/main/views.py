from datetime import date
from . import main as app_main
from .. import db
from ..models.user import User
from flask import render_template, request, redirect, url_for, make_response
from flask_login import login_required, login_user, logout_user


@app_main.route("/")
def main():
    return render_template("login.html")


@app_main.route("/signin", methods=["POST"])
def signin():
    
    email = request.form.get("email", "")
    password = request.form.get("password", "")
    user = User.query.filter_by(email=email).first()
    
    if user is not None and user.verify_password(password):
        login_user(user, False)
        next = request.args.get("next", url_for("main.invoices"))
        response = make_response(redirect(next))
        response.set_cookie('token', user.encode_auth_token().decode(), max_age=1*24*60*60)
        return response

    return redirect(url_for("main.main"))


@app_main.route("/signout")
def signout():
    logout_user()
    return redirect(url_for("main.main"))


@app_main.route("/invoices")
@login_required
def invoices():
    today = date.today()
    ref = str(today.year) + str(today.month).zfill(2)
    return redirect(url_for("main.invoices_by_ref", ref=ref))
    #return render_template("invoices.html")


@app_main.route("/invoices/<string:ref>")
@login_required
def invoices_by_ref(ref):
    return render_template("invoices.html", ref=ref)


@app_main.route("/categories")
@login_required
def categories():
    return render_template("categories.html")


@app_main.route("/banks")
@login_required
def banks():
    return render_template("banks.html")


@app_main.route("/cards")
@login_required
def cards():
    return render_template("cards.html")
