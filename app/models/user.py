import json
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask import url_for, current_app
from flask_login import UserMixin
from .. import db


class User(UserMixin, db.Model):

    __tablename__ = 'tb_users'
    id = db.Column('user_id', db.Integer, primary_key=True)
    name = db.Column('name', db.String(255))
    email = db.Column('user', db.String(255), unique=True, index=True)
    password_hash = db.Column('password', db.String(128))

    def  __repr__(self):
        return '<User %r>' % self.email

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

    @property
    def password(self):
        raise AttributeError("password is not a readable attribute")

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

    def encode_auth_token(self):
        try:
            payload = {
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1),
                'iat': datetime.datetime.utcnow(),
                'sub': json.dumps(self.to_json())
            }
            return jwt.encode(payload, current_app.config.get('SECRET_KEY'), algorithm='HS256')
        except Exception as e:
            return e

    @staticmethod
    def decode_auth_token(auth_token):
        try:
            payload = jwt.decode(auth_token, current_app.config.get('SECRET_KEY'))
            return payload['sub']
        except jwt.ExpiredSignatureError:
            return 'Signature expired. Please log in again.'
        except jwt.InvalidTokenError:
            return 'Invalid token. Please log in again.'

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'url': url_for('api.read_user', id=self.id)
        }

    @staticmethod
    def from_json(json_user):
        name = json_user.get('name', None)
        email = json_user.get('email', None)
        password = json_user.get('password', None)
        return User(name=name, email=email, password=password)

