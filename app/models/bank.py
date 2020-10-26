from flask import current_app
from .. import db
from sqlalchemy import text

class Bank(db.Model):
    __tablename__ = 'tb_banks'
    id = db.Column('bank_id', db.Integer, primary_key=True)
    name = db.Column('name', db.String(255), unique=False)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('tb_users.user_id'))
    type = db.Column('type', db.String(1))
    value = 0

    def __init__(self, **kwargs):
        super(Bank, self).__init__(**kwargs)

    def  __repr__(self):
        return '<Bank %r>' % self.name

    @staticmethod
    def query_banks(user_id):
        sql = text("""
            select b.bank_id, 
                   b.name,
                   b.type,
                   b.user_id,
                   ifnull((
                     select sum(ifnull(i.confirmed_value,0))
                       from tb_invoices i,
                            tb_categories c
                      where i.category_id = c.category_id
                        and i.bank_id = b.bank_id
                        and i.confirmation_date is not null
                        and c.type = 'R'
                    ),0) as value_r,
                    ifnull((
                     select sum(ifnull(i.confirmed_value,0))
                       from tb_invoices i,
                            tb_categories c
                      where i.category_id = c.category_id
                        and i.bank_id = b.bank_id
                        and i.confirmation_date is not null
                        and c.type = 'D'
                   ),0) as value_d
              from tb_banks b
             where user_id = :user_id
               and type = 'D'
            """)
        result = db.engine.execute(sql, user_id=user_id).fetchall()
        banks = []
        for row in result:
            banks.append(Bank(
                id=row.bank_id,
                name=row.name,
                user_id=row.user_id,
                type=row.type,
                value=row.value_r - row.value_d
                ))

        return banks

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'type': self.type,
            'user_id': self.user_id,
            'value': self.value
        }

    @staticmethod
    def from_json(json_bank):
        name = json_bank.get('bank', None)
        return Bank(name=name, type=current_app.config.get('TYPE_DEBIT'))
