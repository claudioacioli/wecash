from flask import current_app
from .. import db
from .bank import Bank


class Card(Bank):
    __tablename__ = 'tb_cards'
    id = db.Column('card_id', db.Integer, db.ForeignKey('tb_banks.bank_id'), primary_key=True)
    limit_value = db.Column('limit_value', db.Float)
    day = db.Column('day', db.Integer)
    limit_day = db.Column('limit_day', db.Integer)
    goal = db.Column('goal', db.Float)

    def __init__(self, **kwargs):
        super(Card, self).__init__(**kwargs)

    def  __repr__(self):
        return '<Card %r>' % self.name

    def to_json(self):
        bank = super().to_json()
        card = {
            'limit_value': self.limit_value,
            'limit_day': self.limit_day,
            'goal': self.goal,
            'day': self.day
            }
        return {**bank, **card}

    @staticmethod
    def from_json(json_card):
        name = json_card.get('card', None)
        limit_value = json_card.get('limit_value', None)
        limit_day = json_card.get('limit_day', None)
        goal = json_card.get('goal', None)
        day = json_card.get('day', None)
        return Card(
                name=name, 
                type=current_app.config.get('TYPE_CREDIT'), 
                limit_value=limit_value,
                goal=goal,
                day=day,
                limit_day=limit_day
                )
