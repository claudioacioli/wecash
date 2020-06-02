from . import main as app_main
from flask import render_template


@app_main.route("/")
def movimentos():
    return render_template('movimentos.html')

