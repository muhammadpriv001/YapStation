from setuptools import setup, Extension
import pybind11

ext_modules = [
    Extension(
        "engine",
        [
            "Engine.cpp",
            "bindings.cpp",

            # YOUR IMPLEMENTED MODULES
            "user/User.cpp",
            "user/Person.cpp",
            "../database/Database.cpp",

            # SQLite (required because Database uses it)
            "../database/sqlite-amalgamation-351030/sqlite3.c",
        ],
        include_dirs=[
            pybind11.get_include(),
            ".",
            "./user",
            "../database",
            "../database/sqlite-amalgamation-351030",
        ],
        language="c++",
    )
]

setup(
    name="engine",
    ext_modules=ext_modules,
)