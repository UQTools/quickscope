from jinja2 import Environment, FileSystemLoader
from pathlib import Path
from requests import get
from shutil import copytree, make_archive
from tempfile import mkdtemp
from typing import Dict, Any
from .templates import generate_config_yaml


CHALKBOX_URL = "https://github.com/UQTools/chalkbox/releases/download/"


def get_chalkbox(version: str, bundle_directory: Path) -> Path:
    response = get(f"{CHALKBOX_URL}/{version}/chalkbox.jar", allow_redirects=True)
    file_path = bundle_directory / "chalkbox.jar"
    with open(f"{file_path}", "wb") as chalkbox:
        chalkbox.write(response.content)
    return file_path


def produce_lib_directory(lib_directory: Path, bundle_directory: Path) -> None:
    copytree(f"{lib_directory}", f"{bundle_directory / 'lib'}")


def produce_resources_directory(lib_directory: Path, bundle_directory: Path) -> None:
    copytree(f"{lib_directory}", f"{bundle_directory / 'resources'}")


def produce_solution_directory(solution: Path, bundle_directory: Path) -> None:
    solutions_directory = bundle_directory.joinpath("solutions")
    solutions_directory.unlink(missing_ok=True)
    copytree(f"{solution}", f"{solutions_directory}")


def produce_config_file(config: Dict[str, Any], bundle_directory: Path) -> None:
    # file_loader = FileSystemLoader("quickscope/templates")
    # environment = Environment(loader=file_loader)
    # config_template = environment.get_template("config.yml")
    with open(f"{bundle_directory / 'config.yml'}", "w") as config_file:
        # content = config_template.render(**config)
        content = generate_config_yaml(config)
        config_file.write(content)


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
    get_chalkbox(config.get("chalkbox_version", "v0.1.0"), bundle_directory)
    produce_lib_directory(Path(config.get("dependencies")), bundle_directory)
    produce_solution_directory(Path(config.get("solutions")), bundle_directory)
    produce_config_file(config, bundle_directory)
    setup_script = "apt-get install -y openjdk-11-jdk\n" \
        "java -version"
    produce_setup_script(setup_calls=setup_script,
                         bundle_directory=bundle_directory)
    produce_run_script(run_call="java -jar chalkbox.jar config.yml",
                       bundle_directory=bundle_directory)
    make_archive(zip_path, "zip", bundle_directory)
    return f"{zip_path}.zip"
