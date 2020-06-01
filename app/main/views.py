from . import main as app_main


@app_main.route("/")
def hello():
    return "Welcome to WeCash FrontEnd"

