from flask import render_template, request

from . import app


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/dependencies", methods=["POST"])
def upload_dependencies():
    print(request.files)
    return "Hello, world"


@app.route("/linter_config", methods=["POST"])
def upload_linter_config():
    print(request.files)
    return "Hello, world"


@app.route("/resources", methods=["POST"])
def upload_resources():
    print(request.files)
    return "Hello, world"


@app.route("/tests", methods=["POST"])
def upload_tests():
    print(request.files)
    return "Hello, world"


@app.route("/correct", methods=["POST"])
def upload_correct():
    print(request.files)
    return "Hello, world"


@app.route("/faulty", methods=["POST"])
def upload_faulty():
    print(request.files)
    return "Hello, world"


@app.route("/generate", methods=["POST"])
def upload():
    print(request.files)
    return "Hello, world"
