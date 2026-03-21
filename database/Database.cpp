//Includes
#include "Database.hpp"
#include <stdexcept>

//Constructor
Database::Database(const string& name) {
    if(sqlite3_open(name.c_str(), &db)) {
        throw runtime_error("Failed to open database");
    }
}

//Destructor
Database::~Database() {
    sqlite3_close(db);
}

//INSERT Query
void Database::execute(const string& query) {
    char* errMsg = nullptr;

    int rc = sqlite3_exec(this->db, query.c_str(), 0, 0, &errMsg);

    if(rc != SQLITE_OK) {
        sqlite3_free(errMsg);
        return;
    }
}

//FETCH Query
sqlite3* Database::get() {
    return this->db;
}