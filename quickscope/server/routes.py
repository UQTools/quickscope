import json
from pathlib import Path

from flask import render_template, request, send_from_directory

from . import app
from .bundle import produce_bundle
from .templates import LOCATIONS, populate_config
from .utils import reconstruct, SUCCESS, FAILURE


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    form = request.form
    session_directory = Path(f"state/{form.get('session')}")
    locations = LOCATIONS.get(form.get("engine"))
    config = populate_config({
        "engine": form.get("engine"),
        "course_code": form.get("course"),
        "assignment_id": form.get("assignment_id"),
        "session_directory": session_directory
    }, form, session_directory, locations)

    bundle_path = Path(produce_bundle(config))
    return send_from_directory(bundle_path.parent, bundle_path.name,
                               as_attachment=True)


@app.route("/upload/<component>", methods=["POST"])
def upload_locations(component: str):
    form = request.form
    print(form.get("session"))
    engine = form.get("engine")
    if not engine or component != form.get("component"):
        return FAILURE

    locations = LOCATIONS.get(engine, None)
    if component not in locations.keys():
        return FAILURE

    reconstruct(form.get("session"), form.get("component"), request.files, locations)

    return SUCCESS
