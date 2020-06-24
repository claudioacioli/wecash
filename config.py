import os
basedir = os.path.abspath(os.path.dirname(__file__))


class Config:

    SECRET_KEY = "dfdkjfoje2e15fr4e8v4f1e5f15e4t6r5t6re5f6d2cd32"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    @staticmethod
    def init_app(app):
        pass


class DevConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'data-dev.sqlite')


class ProdConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'data.sqlite')


config = {
    'dev': DevConfig
}
