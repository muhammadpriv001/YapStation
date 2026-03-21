#pragma once

//Includes
#include "../Database.hpp"
#include <stdexcept>
#include <string>
#include <vector>

using namespace std;

class User {
private:
    //Database Instance
    Database& database;

public:
    //Constructor
    User(Database& db);

    //Register User
    bool registerUser(string fn, string ln, string gender, string uname, string email, string pass);

    //User Login
    bool login(string uname, string pass);

    //Getting All Users
    vector<string> getAllUsers();
};