from pathlib import Path
from subprocess import run, PIPE


def build() -> None:
    install = run(["yarn", "install"],
                  stdout=PIPE,
                  text=True,
                  check=True,
                  cwd="quickscope/gui")
    if install.returncode == 0:
        print("\033[92mFront-End Dependency Installation Successful")
    else:
        print("\033[91mFront-End Dependency Installation Failed")
        raise RuntimeError

    build_ = run(["yarn", "run", "build"],
                 stdout=PIPE,
                 text=True,
                 check=True,
                 cwd="quickscope/gui")
    if build_.returncode == 0:
        print("\033[92mFront-End Build Successful")
    else:
        print("\033[91mFront-End Build Failed")
        raise RuntimeError

    print(f"\u001b[1m\033[92mGUI Build Package Now Available at "
          f"{str(Path('./playground/gui/dist').absolute())}\u001b[0m\u001b[0m")
