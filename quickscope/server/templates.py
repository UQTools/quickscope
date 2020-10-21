from json import loads
from pathlib import Path
from typing import Any, Dict


SETUP_SCRIPTS = {
    "JavaEngine": "apt-get install -y openjdk-11-jdk\n" 
                  "java -version",
    "PythonEngine": "apt install python3\n"
}

DEFAULT = {
    "courseCode": None,
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

JAVA_LOCATIONS = {
    "dependencies": "lib/",
    "resources": "resources/",
    "tests": "solutions/correct/test",
    "correct": "solutions/correct",
    "faulty": "solutions/faulty",
    "structure": "solutions/expected_structure",
    "linter_config": ""
}

PYTHON_LOCATIONS = {
    
}

LOCATIONS = {
    "JavaEngine": JAVA_LOCATIONS,
    "PythonEngine": PYTHON_LOCATIONS
}

PYTHON = {
    "included": [],
    "visible": None
}


def populate_config(config: Dict[str, Any],
                    form: Any,
                    session_directory: Path,
                    locations: Dict[str, str]) -> Dict[str, Any]:
    engine = config.get("engine")

    if engine == "JavaEngine":
        config = {**config, **{
            "dependencies": session_directory.joinpath(locations.get("dependencies")),
            "solutions": session_directory.joinpath("solutions"),
            "resources": session_directory.joinpath("resources"),
            "linter_config": session_directory.joinpath("checkstyle.xml"),
            "java_stages": loads(form.get("java_stages"))
        }}
    elif engine == "PythonEngine":
        config = {**config, **{

        }}
    else:
        raise NotImplementedError

    return config
