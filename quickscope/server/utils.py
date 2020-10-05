from pathlib import Path
from typing import Dict, Mapping

from quickscope.server import app


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
