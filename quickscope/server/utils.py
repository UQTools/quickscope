from pathlib import Path
from typing import Dict, Mapping
from shutil import rmtree
from requests import request
from flask import Response

from quickscope.server import app


SUCCESS = Response(status=200)
FAILURE = Response(status=501)


def make_session(session_id: str) -> Path:
    session_path = Path(app.config["UPLOAD_FOLDER"]).joinpath(session_id)
    if not session_path.exists():
        session_path.mkdir(parents=True, exist_ok=True)
    return session_path


def deep_update(original: Dict, updates: Mapping):
    """
    Update a nested dictionary.
    Modifies original in place.
    """
    for key, value in updates.items():
        if isinstance(value, Mapping) and value:
            returned = deep_update(original.get(key, {}), value)
            original[key] = returned
        else:
            original[key] = updates[key]
    return original


def collapse_path_overlap(clean_file: str, component: str, locations: Dict[str, str]) -> str:
    folders = locations[component].split("/")
    if clean_file.startswith(locations[component]):
        return ""
    elif clean_file.startswith("/".join(folders[1:])):
        return folders[0]
    elif clean_file.startswith("/".join(folders[2:])):
        return "/".join(folders[:1])
    else:
        return locations[component]


def reconstruct(session_id: str, component: str, files, locations: Dict[str, str]) -> None:
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
        parent_directory = session_path.joinpath(component_folder)\
            .joinpath(Path(clean_file).parent)
        file_path = parent_directory.joinpath(Path(file).name)

        if not parent_directory.exists():
            parent_directory.mkdir(parents=True, exist_ok=True)
        if file_path.exists():
            file_path.unlink(missing_ok=True)
        request.files.get(file).save(file_path)
