from flask import url_for
from . import db


class User(db.Model):

    __tablename__ = 'tb_users'
    id = db.Column('user_id', db.Integer, primary_key=True)
    name = db.Column('name', db.String(255))
    email = db.Column('user', db.String(255), unique=True, index=True)
    password = db.Column('password', db.String(128))

    def  __repr__(self):
        return '<User %r>' % self.email

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)

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


