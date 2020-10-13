import json
from functools import wraps
from flask import request
from .errors import unauthorized
from ..models.user import User

def auth_required():
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            
            auth_header = None

            if 'Authorization' in request.headers:
                print("Entrei aqui")
                auth_header = request.headers['Authorization']
            elif 'authorization' in request.headers:
                print("Entrei aqui no minusculo")
                auth_header = request.headers['authorization']
            
            print(auth_header)
            
            if auth_header is None or len(auth_header) == 0:
                return unauthorized("Did you pass authorization header?")

            auth_token = auth_header.split(" ")[1]
            
            if len(auth_token) == 0:
                return unauthorized("Did you pass a token?")

            try:
                payload = User.decode_auth_token(auth_token)
                user = json.loads(payload)
            except Exception as e:
                return unauthorized(e)

            #kwargs['auth_user'] = user
            return f(user, *args, **kwargs)

        return decorated_function
    return decorator
