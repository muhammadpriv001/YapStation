#pragma once

//Includes
#include "sqlite3.h"
#include <string>

using namespace std;

class Database {
private:
    //Database Instance
    sqlite3* db;

public:
    //Constructor
    Database(const string& dbName);

    //Destructor
    ~Database();

    //INSERT Query
    void execute(const string& query);

    //FETCH Query
    sqlite3* get();
};