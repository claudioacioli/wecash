from . import db


class User(db.Model):

    __tablename__ = 'tb_users'
    id = db.Column('user_id', db.Integer, primary_key=True)
    name = db.Column('name', db.String(255))
    email = db.Column('user', db.String(255), unique=True, index=True)
    password = db.Column('password', db.String(128))

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)


