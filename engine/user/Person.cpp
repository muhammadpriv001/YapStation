//Includes
#include "Person.hpp"

//Constructor
Person::Person(string firstName,string lastName, string gender) {
    this->firstName = firstName;
    this->lastName = lastName;
    this->gender = gender;
}

//Getter
string Person::getFullName() const {
    return firstName + " " + lastName;
}

string Person::getGender() const {
    return gender;
}

//Setters
void Person::setFirstName(string firstName) {
    this->firstName = firstName;
}

void Person::setLastName(string lastName) {
    this->lastName = lastName;
}

void Person::setGender(string gender) {
    this->gender = gender;
}