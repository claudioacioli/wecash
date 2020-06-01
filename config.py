

class Config:
    
    @staticmethod
    def init_app(app):
        pass


class DevConfig(Config):
    DEBUG = True


config = {
    'dev': DevConfig
}
