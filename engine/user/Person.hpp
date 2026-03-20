#pragma once

//Includes
#include "../core/BaseEntity.hpp"
#include <string>

using namespace std;

class Person {
private:
    //Attributes
    string firstName;
    string lastName;
    string gender;

public:
    //Constructor
    Person(string firstName = "",string lastName = "", string gender = "");

    //Getter
    string getFullName() const;
    string getGender() const;

    //Setters
    void setFirstName(string firstName);
    void setLastName(string lastName);
    void setGender(string gender);
};