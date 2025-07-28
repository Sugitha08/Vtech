from flask import Flask , Blueprint
from app.config import Config
from app.extension import db, jwt, migrate, limiter, cors 
from app.routes import auth , admin , spradmin , employee
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    limiter.init_app(app)
    cors.init_app(app)
    CORS(app, supports_credentials=True)

    app.register_blueprint(auth, url_prefix='/auth')
    app.register_blueprint(admin, url_prefix='/admin')
    app.register_blueprint(spradmin, url_prefix='/spradmin')
    app.register_blueprint(employee, url_prefix='/employee')


    return app