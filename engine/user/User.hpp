#pragma once

//Includes
#include "Person.hpp"

class User : public Person {
private:
    //Attributes
    string userName;
    string email;
    string password;
    string bio;

public:
    //Constructor
    User(string firstName = "", string lastName = "", string gender = "", string userName = "", string email = "", string password = "", string bio = "");

    //Getters
    string getUserName() const;
    string getEmail() const;
    string getPassword() const;
    string getBio() const;

    //Setters
    void setUserName(string userName);
    void setBio(string bio);

    //Functionality
    bool login(string password);
    void logout();
};