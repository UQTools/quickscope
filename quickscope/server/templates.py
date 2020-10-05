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

PYTHON = {
    "included": [],
    "visible": None
}
