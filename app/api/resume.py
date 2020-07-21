from datetime import datetime
from calendar import monthrange
from flask import jsonify
from . import api as app_api, result
from .errors import page_not_found
from .decorators import auth_required
from .. import db
from ..models.resume import Resume


@app_api.route("/resume/category/<string:year>/<string:month>")
@auth_required()
def read_resume_category(user, year, month):
    user_id = user.get("id")

    week_first_day, last_day = monthrange(int(year),int(month))
    start = '-'.join((year, month, '01'))
    end = '-'.join((year, month, str(last_day).zfill(2)))

    categories = Resume.resume_by_category(user_id, start, end)
    return jsonify(result(categories))
