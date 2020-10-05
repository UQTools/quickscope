from pathlib import Path
from typing import Dict, List
from collections.abc import Mapping

from yaml import dump_all

DEFAULT = {
    "course_code": None,
    "assignment": None,
    "submission": "/autograder/submission/",
    "outputFile": "/autograder/results/results.json",
    "dependencies": []
}

JAVA = {
    "correctSolution": "solutions/correct/src/",
    "conformance": {
        "weighting": 0,
        "expectedStructure": "solutions/correct_structure/",
        "violationPenalty": 0
    },
    "functionality": {
        "weighting": 0,
        "testDirectory": "solutions/correct/test/",
    },
    "junit": {
        "weighting": 0,
        "faultySolutions": "solutions/faulty/",
        "assessableTestClasses": []
    },
    "checkstyle": {
        "weighting": 0,
        "config": "checkstyle.xml",
        "jar": "lib/checkstyle-8.36-all.jar",
        "excluded": [],
        "violationPenalty": 0
    }
}

PYTHON = {
    "included": [],
    "visible": None
}


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


def get_dependencies(dependency_path: Path) -> List[str]:
    dependencies = []
    for path in dependency_path.iterdir():
        if path.is_file():
            dependencies.append(f"{Path(path.parent.name) / path.name}")
    return dependencies


def generate_config_yaml(form: Dict):
    engine = form.get('engine')
    engine_yaml = {"engine": f"chalkbox.engines.{engine}"}

    dependencies = get_dependencies(form.get("dependencies"))

    default = deep_update(DEFAULT, {"course_code": form.get("course_code"),
                                    "assignment": form.get("assignment_id"),
                                    "dependencies": dependencies})

    if engine == "JavaEngine":
        java = deep_update(JAVA, form.get("java_stages"))
        config = {**default, **java}
    elif engine == "PythonEngine":
        config = {**default, **PYTHON}
    else:
        raise NotImplementedError

    config_yaml = dump_all([engine_yaml, config], sort_keys=False)

    return config_yaml


if __name__ == "__main__":
    ex_form = {"engine": "java"}
    print(generate_config_yaml(ex_form))
