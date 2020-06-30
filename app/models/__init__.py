from .. import login_manager
from . import user, bank, card, category, invoice

@login_manager.user_loader
def load_user(user_id):
    return user.User.query.get(int(user_id))

