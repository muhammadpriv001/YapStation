//Includes
#include "User.hpp"

using namespace std;

//Constructor
User::User(Database& db) : database(db) {}

//User Registration
bool User::registerUser(string fn, string ln, string gender, string uname, string email, string pass) {
    string checkQuery =
        "SELECT username FROM users WHERE username='" + uname + "';";

    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(database.get(), checkQuery.c_str(), -1, &stmt, 0);

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        sqlite3_finalize(stmt);
        throw runtime_error("Username already exists");
        return false;
    }

    sqlite3_finalize(stmt);

    string query =
        "INSERT INTO users (firstName, lastName, gender, username, email, password, bio) "
        "VALUES ('" + fn + "','" + ln + "','" + gender + "','" + uname + "','" + email + "','" + pass + "','');";

    database.execute(query);
    return true;
}

//User Login
bool User::login(string uname, string pass) {
    sqlite3_stmt* stmt;

    sqlite3_prepare_v2(database.get(),
        "SELECT password FROM users WHERE username = ?",
        -1, &stmt, 0);

    sqlite3_bind_text(stmt, 1, uname.c_str(), -1, SQLITE_TRANSIENT);

    bool success = false;

    if (sqlite3_step(stmt) == SQLITE_ROW) {
        const unsigned char* dbPassRaw = sqlite3_column_text(stmt, 0);
        string dbPass = dbPassRaw ? (char*)dbPassRaw : "";

        if (dbPass == pass) success = true;
    }

    sqlite3_finalize(stmt);
    return success;
}

//Getting All Users
vector<string> User::getAllUsers() { 
    sqlite3* conn = database.get();
    vector<string> users;

    string sql = "SELECT username FROM users;"; 
    sqlite3_stmt* stmt; sqlite3_prepare_v2(conn, sql.c_str(), -1, &stmt, 0); 
    
    while(sqlite3_step(stmt) == SQLITE_ROW) { 
        string username = (const char*)sqlite3_column_text(stmt, 0); 
        users.push_back(username); 
    } sqlite3_finalize(stmt);

    return users; 
}