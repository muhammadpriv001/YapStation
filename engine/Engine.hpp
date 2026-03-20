#pragma once

//Includes
#include "../database/Database.hpp"
#include <string>
#include <stdexcept>

using namespace std;

class Engine {
private:
    //Databse Instance
    Database db;

public:
    //Constructor
    Engine();

    //User Registration
    void registerUser(string fn, string ln, string gender, string uname, string email, string pass);

    //Login
    bool login(string uname, string pass);
};