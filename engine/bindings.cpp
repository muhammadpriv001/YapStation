#include <pybind11/pybind11.h>
#include "Engine.hpp"

namespace py = pybind11;

PYBIND11_MODULE(engine, m) {
    py::class_<Engine>(m, "Engine")
        .def(py::init<>())
        .def("registerUser", &Engine::registerUser)
        .def("login", &Engine::login);
}