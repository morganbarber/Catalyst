# compile all of our code for the database

from flask import Flask
from routes import api_blueprint
from security import setup_security
from models import Base, engine

app = Flask(__name__)
app.register_blueprint(api_blueprint)

# Security setup
setup_security(app)

# Database initialization
Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    app.run(debug=True)