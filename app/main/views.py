from datetime import date
from . import main as app_main
from .. import db
from ..models.user import User
from ..models.bank import Bank
from flask import render_template, request, redirect, url_for, make_response
from flask_login import login_required, login_user, logout_user, current_user
from htmlmin import minify

OD_COOKIE_EMAIL = 'e'

@app_main.route("/")
def main():
    email = request.cookies.get(OD_COOKIE_EMAIL) or ""
    minified_html = minify(render_template("login.html", email=email))
    return minified_html


@app_main.route("/register")
def register():
    minified_html = minify(render_template("register.html"))
    return minified_html


@app_main.route("/signin", methods=["POST"])
def signin():
    
    email = request.form.get("email", "")
    password = request.form.get("password", "")
    user = User.query.filter_by(email=email).first()
    
    if user is not None and user.verify_password(password):
        login_user(user, False)
        next = request.args.get("next", url_for("main.invoices"))
        response = make_response(redirect(next))
        response.set_cookie(OD_COOKIE_EMAIL, email)
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
    banks = Bank.query.filter_by(user_id=current_user.id).all()
    minified_html = minify(render_template("invoices.html", ref=ref, banks=banks, current_bank_id=request.args.get("b", 0, type=int)))
    return minified_html


@app_main.route("/categories")
@login_required
def categories():
    minified_html = minify(render_template("categories.html"))
    return minified_html


@app_main.route("/banks")
@login_required
def banks():
    minified_html = minify(render_template("banks.html"))
    return minified_html

@app_main.route("/cards")
@login_required
def cards():
    minified_html = minify(render_template("cards.html"))
    return minified_html


@app_main.route("/resume")
@login_required
def resume():
    today = date.today()
    ref = str(today.year) + str(today.month).zfill(2)
    return redirect(url_for("main.resume_by_ref", ref=ref))


@app_main.route("/resume/<string:ref>")
@login_required
def resume_by_ref(ref):
    minified_html = minify(render_template("resume.html", ref=ref))
    return minified_html
