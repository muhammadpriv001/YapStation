//Includes
#include "Database.hpp"
#include <iostream>

//Constructor
Database::Database(string name) {
    if(sqlite3_open(name.c_str(), &db)) {
        cout << "DB Error\n";
    }
}

//Destructor
Database::~Database() {
    sqlite3_close(db);
}

//INSERT Query
bool Database::execute(const string& query) {
    char* errMsg = nullptr;

    int rc = sqlite3_exec(this->db, query.c_str(), 0, 0, &errMsg);

    if(rc != SQLITE_OK) {
        sqlite3_free(errMsg);
        return false;
    }

    return true;
}

//FETCH Query
sqlite3* Database::get() {
    return this->db;
}