import os
import sys

sys.path.insert(0, '/var/www/wecash/venv/lib/python3.8/site-packages')
sys.path.insert(1, '/var/www/wecash')

from app import create_app
application = create_app('prod')

