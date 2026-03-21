#include <pybind11/pybind11.h>
#include <pybind11/stl.h>
#include "Engine.hpp"

namespace py = pybind11;

PYBIND11_MODULE(engine, m) {

    py::class_<Engine>(m, "Engine")
        .def(py::init<>())

        // ========================
        // AUTH
        // ========================
        .def("registerUser", &Engine::registerUser)
        .def("login", &Engine::login)

        // ========================
        // USERS
        // ========================
        .def("getAllUsers", &Engine::getAllUsers)

        // ========================
        // CONVERSATIONS
        // ========================
        .def("createConversation", &Engine::createConversation)
        .def("getUserConversations", &Engine::getUserConversations)
        .def("getConversationUsers", &Engine::getConversationUsers)
        .def("findConversation", &Engine::findConversation)

        // ========================
        // MESSAGES
        // ========================
        .def("sendMessage", &Engine::sendMessage)
        .def("getMessages", &Engine::getMessages);
}