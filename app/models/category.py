from .. import db


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
