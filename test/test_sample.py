import io
from pathlib import Path
from shutil import rmtree

import pytest

from quickscope.server import app


def test_sample() -> None:
    assert 1 + 1 == 2


@pytest.fixture(scope="module")
def test_client():
    testing_client = app.test_client()
    context = app.app_context()
    context.push()

    yield testing_client

    context.pop()


def test_home_page(test_client):
    response = test_client.get("/")
    assert response.status_code == 200
    assert b"<div id=\"root\"></div>" in response.data


def test_upload(test_client):
    response = test_client.post("/upload/linter_config",
                                data={
                                    "session": "57c9d312-4aed-43f3-a36c-aa5eb3d1c50b",
                                    "engine": "JavaEngine",
                                    "assignment_id": "a1",
                                    "course": "CSSE2002",
                                    "component": "linter_config",
                                    "file": (io.BytesIO(b"abcdef"), "checkstyle.xml")
                                },
                                follow_redirects=True,
                                content_type='multipart/form-data'
                                )

    uploaded = Path("state/57c9d312-4aed-43f3-a36c-aa5eb3d1c50b") / "checkstyle.xml"

    assert response.status_code == 200
    assert uploaded.exists()

    rmtree(str(uploaded.parent.parent), ignore_errors=True)
