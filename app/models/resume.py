from .. import db
from sqlalchemy import text


class Resume():

    @staticmethod
    def resume_by_category(user_id, start, end):
        sql = text("""
         select c.category_id,
		max(c.name) name,
		sum(i.expected_value) expected_value,
		max(c.go) goal,
                max(c.type) type
           from tb_invoices i,
		tb_categories c
          where c.category_id = i.category_id
            and i.user_id = :user_id
            and ((strftime('%Y-%m-%d', i.forecast_date/1000, 'unixepoch')
        between :start
            and :end)
             or (confirmation_date is not null
            and  strftime('%Y-%m-%d', i.confirmation_date/1000, 'unixepoch')
        between :start
            and :end))
	    and c.type = 'D'
          group by c.category_id
          order by 3 desc
        """)
        
        result = db.engine.execute(
                sql,
                start=start,
                end=end,
                user_id=user_id
            )
        categories = []
        total_expected_value = 0
        total_goal = 0
        for row in result:
            (category_id, name, expected_value, goal, type) = row
            total_expected_value += expected_value
            total_goal += goal
            categories.append({
                "category_id": category_id, 
                "type": type,
                "name": name,
                "expected_value": '{0:.2f}'.format(expected_value),
                "goal": '{0:.2f}'.format(goal)
                })

        categories.append({
            "category_id": 0,
            "type": None,
            "name": None,
            "expected_value": '{0:.2f}'.format(total_expected_value),
            "goal": '{0:.2f}'.format(total_goal)
        })

        return categories

