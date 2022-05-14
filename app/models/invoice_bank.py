from .. import db
from .invoice import Invoice
from .bank import Bank
from .category import Category
from sqlalchemy import text


class InvoiceBank(Invoice):

    @staticmethod
    def query_banks_between_dates(user_id, start, end):
        sql = text("""
                select b.bank_id,
                       sum(i.expected_value) expected_value,
                       sum(
                         case 
                         when i.confirmation_date is not null 
                         then i.confirmed_value
                         else 0
                         end
                       ) confirmed_value
                  from tb_invoices i,
                       tb_categories c,
                       tb_banks b
                 where i.category_id = c.category_id
                   and i.bank_id = b.bank_id
                   and i.user_id = :user_id
                   and c.type = 'D'
                   and c.remove_me = 0
                   and ((strftime('%Y-%m-%d', i.forecast_date/1000, 'unixepoch')
               between :start
                   and :end)
                    or (i.confirmation_date is not null
                   and  strftime('%Y-%m-%d', i.confirmation_date/1000, 'unixepoch')
               between :start
                   and :end))
                 group by
                    b.bank_id
                 order by 
                    confirmed_value desc,
                    expected_value desc
                 """)
        result = db.engine.execute(
                sql, 
                start=start, 
                end=end, 
                user_id=user_id
                ).fetchall()
        invoices = []
        for row in result:
            # unpack tuple
            (
            bank_id, 
            expected_value, 
            confirmed_value, 
            ) = row

            # append object
            invoices.append(InvoiceBank(
                    bank_id=bank_id,
                    expected_value=expected_value,
                    confirmed_value=confirmed_value,
                    user_id=user_id
                    ))
                   
        return invoices
    
    def to_json(self):
        return {
            'expected_value': self.expected_value,
            'confirmed_value': self.confirmed_value,
            'bank': Bank.query.filter_by(id=self.bank_id).first().to_json()
        }
