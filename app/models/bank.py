from flask import current_app
from .. import db


class Bank(db.Model):
    __tablename__ = 'tb_banks'
    id = db.Column('bank_id', db.Integer, primary_key=True)
    name = db.Column('name', db.String(255), unique=False)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('tb_users.user_id'))
    type = db.Column('type', db.String(1))

    def __init__(self, **kwargs):
        super(Bank, self).__init__(**kwargs)

    def  __repr__(self):
        return '<Bank %r>' % self.name

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'user_id': self.user_id
        }

    @staticmethod
    def from_json(json_bank):
        name = json_bank.get('bank', None)
        return Bank(name=name, type=current_app.config.get('TYPE_DEBIT'))
