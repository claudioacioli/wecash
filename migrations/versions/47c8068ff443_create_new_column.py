"""Create new column

Revision ID: 47c8068ff443
Revises: 6878744f458b
Create Date: 2020-12-29 19:39:46.935373

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '47c8068ff443'
down_revision = '6878744f458b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('tb_users', sa.Column('cards', sa.String(length=1), server_default='0', nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('tb_users', 'cards')
    # ### end Alembic commands ###
