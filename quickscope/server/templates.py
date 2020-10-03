from typing import Dict

from yaml import dump_all


DEFAULT = {
    "engine": None,
    "assignment": None,
    "submission": "/autograder/submission/",
    "outputFile": "/autograder/results/results.json",
    "dependencies": ""
}

JAVA = {
    "conformance": {
        "weighting": 0,
        "expectedStructure": "solutions/correct_structure/",
        "violationPenalty": 0
    },
    "functionality": {
        "weighting": 0,
        "testDirectory": "solutions/correct/test/",
        "violationPenalty": 0
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


def generate_config_yaml(form: Dict):
    engine_yaml = {"engine": f"chalkbox.engines.{form.get('engine').lower()}"}

    config_yaml = dump_all([engine_yaml, {**DEFAULT, **JAVA}], sort_keys=False)

    return config_yaml


if __name__ == "__main__":
    ex_form = {"engine": "java"}
    print(generate_config_yaml(ex_form))

