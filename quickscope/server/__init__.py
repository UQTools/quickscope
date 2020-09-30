from flask import Flask
from pathlib import Path
from flask_cors import CORS
from .config import Config


static_path = str(Path("quickscope/gui/dist/").absolute())


app = Flask(__name__, static_folder=static_path,
            template_folder=static_path,
            static_url_path="")
app.config.from_object(Config)
CORS(app, expose_headers="Access-Control-Allow-Origin")
app.logger.info(f"Static and template directory: {static_path}")


from quickscope.server import routes
