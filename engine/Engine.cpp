//Includes
#include "Engine.hpp"
#include "user/User.hpp"
#include "station/Station.hpp"
#include "content/Post.hpp"
#include "sqlite3.h"

//Constructor
Engine::Engine() : db("yap.db") {
    db.execute(
        "CREATE TABLE IF NOT EXISTS users ("
        "firstName TEXT,"
        "lastName TEXT,"
        "gender TEXT,"
        "username TEXT UNIQUE PRIMARY KEY,"
        "email TEXT,"
        "password TEXT,"
        "bio TEXT);"
    );
}

void Engine::registerUser(string fn, string ln, string uname, string gender, string email, string pass) {
    //Check if username exists
    string checkQuery = "SELECT username FROM users WHERE username='" + uname + "';";

    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db.get(), checkQuery.c_str(), -1, &stmt, 0);

    if(sqlite3_step(stmt) == SQLITE_ROW) {
        sqlite3_finalize(stmt);
        throw runtime_error("Username already exists");
    }

    sqlite3_finalize(stmt);

    //Insert user
    string query = "INSERT INTO users (firstName, lastName, gender, username, email, password, bio) VALUES ('" + fn + "','" + ln + "','" + gender + "','" + uname + "','" + email + "','" + pass + "','');";

    db.execute(query);
}

bool Engine::login(string uname, string pass) {
    string query = "SELECT password FROM users WHERE username='" + uname + "';";

    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(db.get(), query.c_str(), -1, &stmt, 0);

    bool success = false;

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        string dbPass = (const char*)sqlite3_column_text(stmt, 0);
        User temp("", "", uname, "", dbPass, "");

        if (temp.login(pass)) {
            success = true;
        }
    }

    sqlite3_finalize(stmt);
    return success;
}