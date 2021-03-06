from datetime import date
from . import main as app_main
from ..models.user import User
from flask import render_template, request, redirect, url_for, make_response
from flask_login import login_required, login_user, logout_user
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
def sign_in():
    
    email = request.form.get("email", "")
    password = request.form.get("password", "")
    user = User.query.filter_by(email=email).first()
    
    if user is not None and user.verify_password(password):
        login_user(user, False)
        next_view = request.args.get("next", url_for("main.invoices"))
        response = make_response(redirect(next_view))
        response.set_cookie(OD_COOKIE_EMAIL, email, max_age=366*24*60*60)
        response.set_cookie('token', user.encode_auth_token().decode(), max_age=1*24*60*60)
        return response

    return redirect(url_for("main.main"))


@app_main.route("/signout")
def sign_out():
    logout_user()
    return redirect(url_for("main.main"))


@app_main.route("/invoices")
@login_required
def invoices():
    today = date.today()
    ref = str(today.year) + str(today.month).zfill(2)
    return redirect(url_for("main.invoices_by_ref", ref=ref))
    # return render_template("invoices.html")


@app_main.route("/invoices/<string:ref>")
@login_required
def invoices_by_ref(ref):
    minified_html = minify(
            render_template(
                "invoices.html", 
                ref=ref,  
                current_bank_id=request.args.get("b", 0, type=int),
                viewer=request.args.get("v", "D", type=str)
                )
            )
    return minified_html


@app_main.route("/bill")
@login_required
def bill():
    today = date.today()
    ref = str(today.year) + str(today.month).zfill(2)
    return redirect(url_for("main.bill_by_ref", ref=ref))
    # return render_template("invoices.html")


@app_main.route("/bill/<string:ref>")
@login_required
def bill_by_ref(ref):
    minified_html = minify(
            render_template(
                "bill.html", 
                ref=ref,  
                current_bank_id=request.args.get("b", 0, type=int),
                viewer=request.args.get("v", "D", type=str)
                )
            )
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
