from flask import Flask
from .config import Config
from pathlib import Path


static_path = str(Path("quickscope/gui/dist/").absolute())


app = Flask(__name__, static_folder=static_path,
            template_folder=static_path,
            static_url_path="")
app.config.from_object(Config)
app.logger.info(f"Static and template directory: {static_path}")


from quickscope.server import routes
