from pathlib import Path
from shutil import copytree, make_archive
from tempfile import mkdtemp
from typing import Any, Dict, List

from jinja2 import Environment, FileSystemLoader
from requests import get
from yaml import dump_all

from .templates import PYTHON, JAVA, DEFAULT, SETUP_SCRIPTS
from .utils import deep_update

CHALKBOX_URL = "https://github.com/UQTools/chalkbox/releases/download/"


def get_chalkbox(version: str, bundle_directory: Path) -> Path:
    response = get(f"{CHALKBOX_URL}/{version}/chalkbox.jar", allow_redirects=True)
    file_path = bundle_directory / "chalkbox.jar"
    with open(f"{file_path}", "wb") as chalkbox:
        chalkbox.write(response.content)
    return file_path


def produce_lib_directory(lib_directory: Path, bundle_directory: Path) -> None:
    if lib_directory.exists():
        copytree(f"{lib_directory}", f"{bundle_directory / 'lib'}")
    else:
        lib_directory.mkdir(parents=True)


def produce_resources_directory(lib_directory: Path, bundle_directory: Path) -> None:
    if lib_directory.exists():
        copytree(f"{lib_directory}", f"{bundle_directory / 'resources'}")
    else:
        lib_directory.mkdir(parents=True)


def produce_solution_directory(solution: Path, bundle_directory: Path) -> None:
    solutions_directory = bundle_directory.joinpath("solutions")
    solutions_directory.unlink(missing_ok=True)
    if solution.exists():
        copytree(f"{solution}", f"{solutions_directory}")
    else:
        solution.mkdir(parents=True)


def get_dependencies(dependency_path: Path) -> List[str]:
    dependencies = []
    for path in dependency_path.iterdir():
        if path.is_file():
            dependencies.append(f"{Path(path.parent.name) / path.name}")
    return dependencies


def reformat_test_classes(config: Dict[str, Any], session_directory: Path):
    test_directory: Path = session_directory / "solutions/correct/test"
    test_classes = config.get("junit").get("assessableTestClasses")
    java_paths = []
    for test_class in test_classes:
        matches = list(test_directory.glob(f"**/{test_class}"))
        if not matches:
            raise FileNotFoundError
        match = matches[0]
        text = f"{'.'.join(match.parts[5:])}".replace(".java", "")
        java_paths.append(text)
    config["junit"]["assessableTestClasses"] = java_paths


def produce_config_file(form: Dict[str, Any], bundle_directory: Path) -> None:
    engine = form.get('engine')
    engine_yaml = {"engine": f"chalkbox.engines.{engine}"}
    dependencies = get_dependencies(form.get("dependencies"))
    default = deep_update(DEFAULT, {"courseCode": form.get("course_code"),
                                    "assignment": form.get("assignment_id"),
                                    "dependencies": dependencies})

    if engine == "JavaEngine":
        java = deep_update(JAVA, form.get("java_stages"))
        settings = {**default, **java}
        reformat_test_classes(settings, form.get("session_directory"))
    elif engine == "PythonEngine":
        settings = {**default, **PYTHON}
    else:
        raise NotImplementedError

    config_yaml = dump_all([engine_yaml, settings], sort_keys=False)

    with open(f"{bundle_directory / 'config.yml'}", "w") as config_file:
        config_file.write(config_yaml)


def produce_setup_script(setup_calls: str, bundle_directory: Path) -> None:
    file_loader = FileSystemLoader("quickscope/templates")
    environment = Environment(loader=file_loader)
    setup_template = environment.get_template("setup.sh")
    with open(f"{bundle_directory / 'setup.sh'}", "w") as run_script:
        content = setup_template.render(setup_calls=setup_calls)
        run_script.write(content)


def produce_run_script(run_call: str, bundle_directory: Path = None) -> None:
    file_loader = FileSystemLoader("quickscope/templates")
    environment = Environment(loader=file_loader)
    run_template = environment.get_template("run_autograder")
    with open(f"{bundle_directory / 'run_autograder'}", "w") as run_script:
        content = run_template.render(run_call=run_call)
        run_script.write(content)


def produce_bundle(config: Dict[str, Any]) -> str:
    bundle_directory = Path(mkdtemp()) / "autograder"
    zip_path = f"{bundle_directory}"
    Path.mkdir(bundle_directory)
    get_chalkbox(config.get("chalkbox_version", "v0.2.0"), bundle_directory)
    produce_lib_directory(Path(config.get("dependencies")), bundle_directory)
    produce_solution_directory(Path(config.get("solutions")), bundle_directory)
    produce_config_file(config, bundle_directory)
    setup_script = SETUP_SCRIPTS.get(config.get("engine"))
    produce_setup_script(setup_calls=setup_script,
                         bundle_directory=bundle_directory)
    produce_run_script(run_call="java -jar chalkbox.jar config.yml",
                       bundle_directory=bundle_directory)
    make_archive(zip_path, "zip", bundle_directory)
    return f"{zip_path}.zip"
