from jinja2 import Environment, FileSystemLoader
from os import mkdir
from pathlib import Path
from requests import get
from shutil import copyfile, copytree, make_archive
from tempfile import mkdtemp
from typing import Dict


CHALKBOX_URL = "https://github.com/UQTools/chalkbox/releases/download/"


def get_chalkbox(version: str, bundle_directory: Path) -> Path:
    response = get(f"{CHALKBOX_URL}/{version}/chalkbox.jar", allow_redirects=True)
    file_path = bundle_directory / "chalkbox.jar"
    with open(f"{file_path}", "wb") as chalkbox:
        chalkbox.write(response.content)
    return file_path


def produce_lib_directory(lib_directory: Path, bundle_directory: Path) -> None:
    copytree(f"{lib_directory}", f"{bundle_directory / 'lib'}")


def produce_solution_directory(solution: Path, tests: Path, bundle_directory: Path) -> None:
    solutions_directory = bundle_directory / "solution"
    mkdir(f"{solutions_directory}")
    copytree(f"{solution}", f"{solutions_directory / 'src'}")
    copytree(f"{tests}", f"{solutions_directory / 'test'}")


def produce_config_file(config: Dict[str, str], bundle_directory: Path) -> None:
    file_loader = FileSystemLoader("quickscope/templates")
    environment = Environment(loader=file_loader)
    config_template = environment.get_template("config.yml")
    with open(f"{bundle_directory / 'config.yml'}", "w") as config_file:
        content = config_template.render(**config)
        config_file.write(content)


def produce_setup_script(setup_call: str, bundle_directory: Path) -> None:
    file_loader = FileSystemLoader("quickscope/templates")
    environment = Environment(loader=file_loader)
    setup_template = environment.get_template("setup.sh")
    with open(f"{bundle_directory / 'setup.sh'}", "w") as run_script:
        content = setup_template.render(setup_call=setup_call)
        run_script.write(content)


def produce_run_script(run_call: str, bundle_directory: Path = None) -> None:
    file_loader = FileSystemLoader("quickscope/templates")
    environment = Environment(loader=file_loader)
    run_template = environment.get_template("run_autograder")
    with open(f"{bundle_directory / 'run_autograder'}", "w") as run_script:
        content = run_template.render(run_call=run_call)
        run_script.write(content)


def produce_bundle(config: Dict[str, str]) -> str:
    bundle_directory = Path(mkdtemp()) / "autograder"
    zip_path = f"{bundle_directory}.zip"
    Path.mkdir(bundle_directory)
    chalkbox = get_chalkbox(config.get("chalkbox_version", "v0.1.0"),
                            bundle_directory)
    copyfile(f"{chalkbox}", f"{bundle_directory / 'chalkbox.jar'}")
    produce_lib_directory(Path(config.get("lib_directory")), bundle_directory)
    produce_solution_directory(Path(config.get("solution_directory")), bundle_directory)
    produce_config_file(config, bundle_directory)
    setup_script = "add-apt-repository ppa:openjdk-r/ppa" \
                   "apt-get install -y openjdk-14-jdk" \
                   "java -version"
    produce_setup_script(setup_call=setup_script,
                         bundle_directory=bundle_directory)
    produce_run_script(run_call="java -jar chalkbox-all.jar config.yml",
                       bundle_directory=bundle_directory)
    make_archive(zip_path, "zip", bundle_directory)
    return zip_path
