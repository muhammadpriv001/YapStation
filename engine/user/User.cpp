//Includes
#include "User.hpp"

//Constructor
User::User(string firstName, string lastName, string gender, string userName, string email, string password, string bio) : Person(firstName, lastName, gender) {
    this->userName = userName;
    this->email = email;
    this->password = password;
    this->bio = bio;
}

//Getters
string User::getUserName() const {
    return userName;
}

string User::getEmail() const {
    return email;
}

string User::getPassword() const {
    return password;
}

string User::getBio() const {
    return bio;
}

//Setters
void User::setUserName(string userName) {
    this->userName = userName;
}

void User::setBio(string bio) {
    this->bio = bio;
}

//Functionality
bool User::login(string password) {
    return this->password == password;
}

void User::logout() {

}