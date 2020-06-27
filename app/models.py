import json
import jwt
import datetime
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash
from flask import url_for, current_app
from flask_login import UserMixin
from . import db, login_manager


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


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


class Card(Bank):
    __tablename__ = 'tb_cards'
    id = db.Column('card_id', db.Integer, db.ForeignKey('tb_banks.bank_id'), primary_key=True)
    limit_value = db.Column('limit_value', db.Float)
    day = db.Column('day', db.Integer)
    goal = db.Column('goal', db.Float)

    def __init__(self, **kwargs):
        super(Card, self).__init__(**kwargs)

    def  __repr__(self):
        return '<Card %r>' % self.name

    def to_json(self):
        bank = super().to_json()
        card = {
            'limit_value': self.limit_value,
            'goal': self.goal,
            'day': self.day
            }
        return {**bank, **card}

    @staticmethod
    def from_json(json_card):
        name = json_card.get('card', None)
        limit_value = json_card.get('limit_value', None)
        goal = json_card.get('goal', None)
        day = json_card.get('day', None)
        return Card(
                name=name, 
                type=current_app.config.get('TYPE_CREDIT'), 
                limit_value=limit_value,
                goal=goal,
                day=day
                )


class Category(db.Model):
    __tablename__ = 'tb_categories'
    id = db.Column('category_id', db.Integer, primary_key=True)
    name = db.Column('name', db.String(255))
    type = db.Column('type', db.String(1))
    go = db.Column('go', db.Float)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('tb_users.user_id'))

    def __init__(self, **kwargs):
        super(Category, self).__init__(**kwargs)

    def  __repr__(self):
        return '<Category %r>' % self.name

    def to_json(self):
        return {
            'id': self.id,
            'category': self.name,
            'type': self.type,
            'go': self.go,
            'user_id': self.user_id
        }

    @staticmethod
    def from_json(json_category):
        name = json_category.get('category', None)
        type = json_category.get('type', None)
        go = json_category.get('go', None)
        user_id = json_category.get('user_id', None)
        return Category(name=name, go=go, type=type, user_id=user_id)


class Invoice(db.Model):
    __tablename__ = 'tb_invoices'
    id = db.Column('invoice_id', db.Integer, primary_key=True)
    history = db.Column('history', db.String(255))
    forecast_date = db.Column('forecast_date', db.Integer)
    confirmation_date = db.Column('confirmation_date', db.Integer)
    expected_value = db.Column('expected_value', db.Float)
    confirmed_value = db.Column('confirmed_value', db.Float)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('tb_users.user_id'))
    bank_id = db.Column('bank_id', db.Integer, db.ForeignKey('tb_banks.bank_id'))
    category_id = db.Column('category_id', db.Integer, db.ForeignKey('tb_categories.category_id')) 

    def to_json(self):
        return {
            'id': self.id,
            'history': self.history,
            'forecast_date': self.forecast_date,
            'confirmation_date': self.confirmation_date,
            'expected_value': self.expected_value,
            'confirmed_value': self.confirmed_value,
            'bank': Bank.query.filter_by(id=self.bank_id).first().to_json(),
            'category': Category.query.filter_by(id=self.category_id).first().to_json()
        }

    @staticmethod
    def query_pendencies(user_id):
        sql = text("""
                select * 
                  from tb_invoices 
                 where user_id = :user_id
                   and strftime('%Y-%m-%d', forecast_date/1000, 'unixepoch') < date('now', 'start of month')
                   and confirmation_date is null
                 """)
        result = db.engine.execute(sql, user_id=user_id).fetchall()
        invoices = []
        for row in result:
            # unpack tuple
            (id, history, forecast_date,
            confirmation_date, expected_value, confirmed_value, 
            user_id, bank_id, category_id) = row
            # append object
            invoices.append(Invoice(
                    id=id,
                    history=history,
                    forecast_date=forecast_date,
                    confirmation_date=confirmation_date,
                    expected_value=expected_value,
                    confirmed_value=confirmed_value,
                    user_id=user_id,
                    bank_id=bank_id,
                    category_id=category_id))
        return invoices
    
    @staticmethod
    def query_between_dates(user_id, start, end):
        sql = text("""
                select * 
                  from tb_invoices 
                 where user_id = :user_id
                   and ((strftime('%Y-%m-%d', forecast_date/1000, 'unixepoch')
               between :start
                   and :end)
                    or (confirmation_date is not null
                   and  strftime('%Y-%m-%d', confirmation_date/1000, 'unixepoch')
               between :start
                   and :end))
                 """)
        result = db.engine.execute(sql, start=start, end=end, user_id=user_id).fetchall()
        invoices = []
        for row in result:
            # unpack tuple
            (id, history, forecast_date,
            confirmation_date, expected_value, confirmed_value, 
            user_id, bank_id, category_id) = row
            # append object
            invoices.append(Invoice(
                    id=id,
                    history=history,
                    forecast_date=forecast_date,
                    confirmation_date=confirmation_date,
                    expected_value=expected_value,
                    confirmed_value=confirmed_value,
                    user_id=user_id,
                    bank_id=bank_id,
                    category_id=category_id))
        return invoices

    @staticmethod
    def from_json(json_invoice):
        history = json_invoice.get('history', None)
        forecast_date = json_invoice.get('forecast_date', None)
        confirmation_date = json_invoice.get('confirmation_date', None)
        expected_value = json_invoice.get('expected_value', None)
        confirmed_value = str(json_invoice.get('confirmed_value', None)) or None
        bank_id = json_invoice.get('bank_id', None)
        category_id = json_invoice.get('category_id', None)

        return Invoice(
                history = history,
                forecast_date = forecast_date,
                confirmation_date = confirmation_date,
                expected_value=expected_value,
                confirmed_value=confirmed_value,
                bank_id=bank_id,
                category_id=category_id)

