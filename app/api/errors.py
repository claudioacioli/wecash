from flask import jsonify, request, render_template
from . import api as app_api


def unauthorized(message):
    response = jsonify({'status': 401, 'message': 'unauthorized', 'payload': message})
    response.status_code = 401
    return response


def page_not_found():
    response = jsonify({'status': 404, 'message': 'not found'})
    response.status_code = 404
    return response

