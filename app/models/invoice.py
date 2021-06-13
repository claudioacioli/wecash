from .. import db
from .bank import Bank
from .card import Card
from .category import Category
from sqlalchemy import text


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
    def query_between_dates(user_id, start, end, bank_id=0, bank_type="D"):
        sql = text("""
                select i.* 
                  from tb_invoices i,
                       tb_banks b
                 where i.bank_id = b.bank_id
                   and i.user_id = :user_id
                   and ((strftime('%Y-%m-%d', i.forecast_date/1000, 'unixepoch')
               between :start
                   and :end
                   and i.confirmation_date is null)
                    or (i.confirmation_date is not null
                   and  strftime('%Y-%m-%d', i.confirmation_date/1000, 'unixepoch')
               between :start
                   and :end))
                   and i.bank_id = (case :bank_id 
                                  when 0 then i.bank_id
                                  else :bank_id 
                                  end)
                   and b.type = :bank_type
                 order by case when i.confirmation_date is null then 0 else 1 end,
                          i.confirmation_date,
                          i.forecast_date
                 """)
        result = db.engine.execute(
                sql, 
                start=start, 
                end=end, 
                user_id=user_id, 
                bank_id=bank_id,
                bank_type=bank_type
                ).fetchall()
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

