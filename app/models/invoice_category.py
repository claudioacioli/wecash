from .. import db
from .invoice import Invoice
from .bank import Bank
from .category import Category
from sqlalchemy import text


class InvoiceCategory(Invoice):

    @staticmethod
    def query_categories_between_dates(user_id, start, end, bank_id):
        sql = text("""
                select c.category_id,
                       sum(i.expected_value) expected_value,
                       sum(
                         case 
                         when i.confirmation_date is not null 
                         then i.confirmed_value
                         else 0
                         end
                       ) confirmed_value
                  from tb_invoices i,
                       tb_categories c
                 where i.category_id = c.category_id
                   and i.user_id = :user_id
                   and ((strftime('%Y-%m-%d', i.forecast_date/1000, 'unixepoch')
               between :start
                   and :end)
                    or (i.confirmation_date is not null
                   and  strftime('%Y-%m-%d', i.confirmation_date/1000, 'unixepoch')
               between :start
                   and :end))
                   and bank_id = (case :bank_id 
                                  when 0 then i.bank_id
                                  else :bank_id 
                                  end)
                 group by
                    c.category_id
                 order by 
                    max(c.type) desc,
                    confirmed_value desc,
                    expected_value desc
                 """)
        result = db.engine.execute(
                sql, 
                start=start, 
                end=end, 
                user_id=user_id, 
                bank_id=bank_id
                ).fetchall()
        invoices = []
        for row in result:
            # unpack tuple
            (
            category_id, 
            expected_value, 
            confirmed_value, 
            ) = row

            # append object
            invoices.append(InvoiceCategory(
                    category_id=category_id, 
                     
                    expected_value=expected_value,
                    confirmed_value=confirmed_value,
                    user_id=user_id
                    ))
                   
        return invoices
    
    def to_json(self):
        return {
            'expected_value': self.expected_value,
            'confirmed_value': self.confirmed_value,
            'category': Category.query.filter_by(id=self.category_id).first().to_json()
        }
