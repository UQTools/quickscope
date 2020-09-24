from flask import render_template, request

from . import app


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/upload_lib")
def upload_lib():
    pass


@app.route("/upload_dependencies")
def upload_dependencies():
    pass


@app.route("/upload_resources")
def upload_resources():
    pass


@app.route("/upload_tests")
def upload_tests():
    pass


@app.route("/upload_solution")
def upload_solution():
    pass


@app.route("/upload_faulty_solutions")
def upload_faulty_solutions():
    pass


@app.route("/upload", methods=["POST"])
def upload():
    print(request.data)
    return "Hello, world"
