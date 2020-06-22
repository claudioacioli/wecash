"""empty message

Revision ID: 9e4ddb045358
Revises: 6999d8ead68c
Create Date: 2020-06-21 23:20:50.592163

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9e4ddb045358'
down_revision = '6999d8ead68c'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('tb_categories', sa.Column('go', sa.Float(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('tb_categories', 'go')
    # ### end Alembic commands ###
