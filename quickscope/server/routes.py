import json
from pathlib import Path
from shutil import rmtree

from flask import render_template, request, Response, send_from_directory
from flask_cors import cross_origin

from . import app
from .bundle import produce_bundle
from .utils import make_session

SUCCESS = Response(status=200)
locations = {
    "dependencies": "lib/",
    "resources": "resources/",
    "tests": "solutions/correct/test",
    "correct": "solutions/correct",
    "faulty": "solutions/faulty",
    "structure": "solutions/expected_structure",
    "linter_config": ""
}


def collapse_path_overlap(clean_file: str, component: str) -> str:
    folders = locations[component].split("/")
    if clean_file.startswith(locations[component]):
        return ""
    elif clean_file.startswith("/".join(folders[1:])):
        return folders[0]
    elif clean_file.startswith("/".join(folders[2:])):
        return "/".join(folders[:1])
    else:
        return locations[component]


def reconstruct(session_id: str, component: str, files) -> None:
    session_path = make_session(session_id)
    if component == "linter_config":
        file_name = None
        for file_name_ in files:
            file_name = file_name_

        file_path = session_path.joinpath("checkstyle.xml")
        file_path.unlink(missing_ok=True)
        if file_name:
            file = request.files.get(file_name)
            file.save(file_path)
        return
    subdirectory = session_path.joinpath(locations[component])
    if subdirectory.exists():
        rmtree(session_path.joinpath(locations[component]))
    for file in files:
        clean_file = file[1:] if file.startswith('/') else file
        component_folder = collapse_path_overlap(clean_file, component)
        parent_directory = session_path.joinpath(component_folder).joinpath(Path(clean_file).parent)
        file_path = parent_directory.joinpath(Path(file).name)
        if not parent_directory.exists():
            parent_directory.mkdir(parents=True, exist_ok=True)
        if file_path.exists():
            file_path.unlink(missing_ok=True)
        request.files.get(file).save(file_path)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/dependencies", methods=["POST", "OPTIONS"])
@cross_origin()
def upload_dependencies():
    form = request.form
    reconstruct(form.get("session"), form.get("component"), request.files)
    return SUCCESS


@app.route("/linter_config", methods=["POST"])
def upload_linter_config():
    form = request.form
    reconstruct(form.get("session"), form.get("component"), request.files)
    return SUCCESS


@app.route("/resources", methods=["POST"])
def upload_resources():
    form = request.form
    reconstruct(form.get("session"), form.get("component"), request.files)
    return SUCCESS


@app.route("/tests", methods=["POST"])
def upload_tests():
    form = request.form
    reconstruct(form.get("session"), form.get("component"), request.files)
    return SUCCESS


@app.route("/correct", methods=["POST"])
def upload_correct():
    form = request.form
    reconstruct(form.get("session"), form.get("component"), request.files)
    return SUCCESS


@app.route("/faulty", methods=["POST"])
def upload_faulty():
    form = request.form
    reconstruct(form.get("session"), form.get("component"), request.files)
    return SUCCESS


@app.route("/structure", methods=["POST"])
def upload_structure():
    form = request.form
    reconstruct(form.get("session"), form.get("component"), request.files)
    return SUCCESS


@app.route("/generate", methods=["POST"])
def generate():
    form = request.form
    session_directory = Path(f"state/{form.get('session')}")
    config = {
        "engine": form.get("engine"),
        "dependencies": session_directory.joinpath(locations.get("dependencies")),
        "solutions": session_directory.joinpath("solutions"),
        "resources": session_directory.joinpath("resources"),
        "course_code": form.get("course"),
        "assignment_id": form.get("assignment_id"),
        "linter_config": session_directory.joinpath("checkstyle.xml"),
        # More to come
    }

    if form.get("java_stages", None):
        config["java_stages"] = json.loads(form.get("java_stages"))

    bundle_path = Path(produce_bundle(config))
    print(bundle_path)
    print(bundle_path.parent)
    print(bundle_path.name)
    return send_from_directory(bundle_path.parent, bundle_path.name,
                               as_attachment=True)
