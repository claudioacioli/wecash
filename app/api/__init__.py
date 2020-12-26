from flask import Blueprint

api = Blueprint('api', __name__)


def result(payload, status=1, message="OK"):
    return {"status": status,
            "message": message,
            "payload": payload}


from . import (
        decorators, 
        errors, 
        users, 
        overview,  
        banks, 
        cards, 
        categories, 
        invoices, 
        resume
        )
