from pathlib import Path
from shutil import copytree, make_archive, copyfile
from tempfile import mkdtemp
from typing import Any, Dict, List

from jinja2 import Environment, FileSystemLoader
from requests import get
from yaml import dump_all

from .templates import PYTHON, JAVA, DEFAULT, SETUP_SCRIPTS
from .utils import deep_update

CHALKBOX_URL = "https://github.com/UQTools/chalkbox/releases/download/"


def get_chalkbox(version: str, bundle_directory: Path) -> Path:
    """
    Procures the specified version of ChalkBox from GitHub releases.

    :param version: the version of ChalkBox to get (e.g. v0.2.0)
    :param bundle_directory: the path to the temporary directory in which the bundle is constructed
    :return: the path to the ChalkBox JAR in the temporary bundle directory.
    """
    response = get(f"{CHALKBOX_URL}/{version}/chalkbox.jar", allow_redirects=True)
    file_path = bundle_directory / "chalkbox.jar"
    with open(f"{file_path}", "wb") as chalkbox:
        chalkbox.write(response.content)
    return file_path


def produce_lib_directory(lib_directory: Path, bundle_directory: Path) -> None:
    """
    JavaEngine specific. Gathers the lib file containing JAR dependencies and copies it to the
    temporary bundle directory.

    :param lib_directory: the lib directory with JAR dependencies uploaded by the user
    :param bundle_directory: the temporary directory where the bundle is being created
    """
    if lib_directory.exists():
        copytree(f"{lib_directory}", f"{bundle_directory / 'lib'}")
    else:
        lib_directory.mkdir(parents=True)


def produce_resources_directory(resources_directory: Path, bundle_directory: Path) -> None:
    """
    JavaEngine specific. Gathers the static resources directory and files uploaded by the user and
    copies them to the temporary bundle directory.

    :param resources_directory: the static resources directory populated by the user's uploads
    :param bundle_directory: the temporary directory where the bundle is being created
    """
    if resources_directory.exists():
        copytree(f"{resources_directory}", f"{bundle_directory / 'resources'}")
    else:
        resources_directory.mkdir(parents=True)


def produce_solution_directory(solution_directory: Path, bundle_directory: Path) -> None:
    """
    Copies the solution directory uploaded by the user to the temporary bundle directory.

    :param solution_directory: the directory containing the correct and faulty solutions uploaded
        by the user
    :param bundle_directory: the temporary directory where the bundle is being created
    """
    solutions_directory = bundle_directory.joinpath("solutions")
    solutions_directory.unlink(missing_ok=True)
    if solution_directory.exists():
        copytree(f"{solution_directory}", f"{solutions_directory}")
    else:
        solution_directory.mkdir(parents=True)


def get_dependencies(dependency_directory: Path) -> List[str]:
    """
    Creates a list of dependencies based on the contents of the dependency directory.

    :param dependency_directory: where the dependencies uploaded by the user are stored
    :return: a list of the dependencies' paths (including the dependency directory)
    """
    dependencies = []
    for path in dependency_directory.iterdir():
        if path.is_file():
            dependencies.append(f"{Path(path.parent.name) / path.name}")
    return dependencies


def reformat_test_classes(config: Dict[str, Any], session_directory: Path) -> None:
    """
    JavaEngine specific. Transforms the assessable test classes listed in the config from Java
    import style (e.g. chalkbox.import.style) to path style (e.g. chalkbox/import/style.java).

    :param config: the config dictionary containing the test classes to update
    :param session_directory: the directory associated with the user's session where the user's
        uploads are stored
    """
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
    """
    Takes the form from the React front-end and uses it, in combination with the engine default
    settings, to populate the configuration and write it to the config.yaml file in the bundle
    directory.

    :param form: the immutable form dictionary from the request object populated by the React
        front-end
    :param bundle_directory: the temporary directory where the bundle is being created
    """
    engine = form.get('engine')
    engine_yaml = {"engine": f"chalkbox.engines.{engine}"}

    default = deep_update(DEFAULT, {"courseCode": form.get("course_code"),
                                    "assignment": form.get("assignment_id")})

    if engine == "JavaEngine":
        dependencies = get_dependencies(form.get("dependencies"))
        default = deep_update(default, {"dependencies": dependencies})
        java = deep_update(JAVA, form.get("java_stages"))
        settings = {**default, **java}
        reformat_test_classes(settings, form.get("session_directory"))
    elif engine == "PythonEngine":
        python = deep_update(PYTHON, {
            "fileName": form.get("fileName"),
            "runner": form.get("runner"),
        })
        settings = {**default, **python}
    else:
        raise NotImplementedError

    config_yaml = dump_all([engine_yaml, settings], sort_keys=False)

    with open(f"{bundle_directory / 'config.yml'}", "w") as config_file:
        config_file.write(config_yaml)


def produce_setup_script(setup_calls: str, bundle_directory: Path) -> None:
    """
    Creates the setup.sh script - required by Gradescope to prepare the Ubuntu environment - and
    places it in the bundle.

    :param setup_calls: the calls made to e.g. install packages, set the PATH etc. These come from
        .templates.py
    :param bundle_directory: the temporary directory where the bundle is being created
    """
    file_loader = FileSystemLoader("quickscope/templates")
    environment = Environment(loader=file_loader)
    setup_template = environment.get_template("setup.sh")
    with open(f"{bundle_directory / 'setup.sh'}", "w") as run_script:
        content = setup_template.render(setup_calls=setup_calls)
        run_script.write(content)


def produce_run_script(run_call: str, bundle_directory: Path = None) -> None:
    """
    Creates the run.sh script in the root of the bundle that is used by Gradescope to start the
    autograding process.

    :param run_call: typically the call to start ChalkBox with whatever arguments are required
    :param bundle_directory: the temporary directory where the bundle is being created
    """
    file_loader = FileSystemLoader("quickscope/templates")
    environment = Environment(loader=file_loader)
    run_template = environment.get_template("run_autograder")
    with open(f"{bundle_directory / 'run_autograder'}", "w") as run_script:
        content = run_template.render(run_call=run_call)
        run_script.write(content)


def produce_included_directory(source: Path, bundle_directory: Path) -> None:
    """
    PythonEngine specific. Copies the entire 'included' directory with its uploaded components into
    the root of the bundle.

    :param source: the original location of the included directory as uploaded by the user
    :param bundle_directory: the temporary directory where the bundle is being created
    """
    copytree(f"{source}", f"{bundle_directory}")


def copy_testrunner(bundle_directory: Path) -> None:
    """
    PythonEngine specific. Copies the testrunner.py testing utility package from ../templates into
    the included directory in the bundle.

    :param bundle_directory: the temporary directory where the bundle is being created
    """
    testrunner = Path("quickscope/templates/testrunner.py")
    if testrunner.exists():
        copyfile(testrunner, bundle_directory / "included/testrunner.py")
    else:
        raise NameError


def produce_bundle(config: Dict[str, Any]) -> str:
    """
    Performs bundle construction from the various elements based on the Engine and configuration
    specified.

    :param config: the configuration dictionary as prepared by .templates.populate_config
    :return: the path to the zipped bundle as a string
    """
    bundle_directory = Path(mkdtemp()) / "autograder"
    zip_path = f"{bundle_directory}"
    Path.mkdir(bundle_directory)
    get_chalkbox(config.get("chalkbox_version", "v0.2.0"), bundle_directory)
    engine = config.get("engine")

    if engine == "JavaEngine":
        produce_lib_directory(Path(config.get("dependencies")), bundle_directory)
        produce_solution_directory(Path(config.get("solutions")), bundle_directory)
        linter_config: Path = config.get("session_directory").joinpath("checkstyle.xml")
        if linter_config.exists():
            copyfile(linter_config, bundle_directory.joinpath("checkstyle.xml"))
    elif engine == "PythonEngine":
        produce_included_directory(config.get("included"), bundle_directory.joinpath("included"))
        copy_testrunner(bundle_directory)
    else:
        raise NotImplementedError

    produce_config_file(config, bundle_directory)
    setup_script = SETUP_SCRIPTS.get(engine)
    produce_setup_script(setup_calls=setup_script,
                         bundle_directory=bundle_directory)
    produce_run_script(run_call="java -jar chalkbox.jar config.yml",
                       bundle_directory=bundle_directory)
    make_archive(zip_path, "zip", bundle_directory)
    return f"{zip_path}.zip"
