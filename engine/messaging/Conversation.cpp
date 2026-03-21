//Includes
#include "Conversation.hpp"
#include <algorithm>

using namespace std;

//Constructor
Conversation::Conversation(Database& database) : db(database) {}

//===========================
//FUNCTIONALITY
//===========================

//Conversation Creator
int Conversation::createConversation(vector<string> users, bool isGroup, string name) {
    sqlite3* conn = db.get();
    char* err;

    string sql =
        "INSERT INTO conversations (name, is_group) VALUES ('" +
        name + "', " + to_string(isGroup) + ");";

    sqlite3_exec(conn, sql.c_str(), 0, 0, &err);

    int convId = sqlite3_last_insert_rowid(conn);

    for (auto& u : users) {
        string link =
            "INSERT INTO conversation_users (conversation_id, username) VALUES (" +
            to_string(convId) + ", '" + u + "');";

        sqlite3_exec(conn, link.c_str(), 0, 0, &err);
    }

    return convId;
}

//Getter User Conversations
vector<string> Conversation::getConversationUsers(int conversationId) {
    sqlite3* conn = db.get();
    vector<string> users;

    string sql =
        "SELECT username FROM conversation_users WHERE conversation_id = " +
        to_string(conversationId) + ";";

    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(conn, sql.c_str(), -1, &stmt, 0);

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        users.push_back((char*)sqlite3_column_text(stmt, 0));
    }

    sqlite3_finalize(stmt);
    return users;
}

//Getter Conversations Users
vector<string> Conversation::getUserConversations(string username) {
    sqlite3* conn = db.get();
    vector<string> result;

    string sql =
        "SELECT c.id, c.is_group "
        "FROM conversations c "
        "WHERE c.id IN ("
        "SELECT conversation_id FROM conversation_users WHERE username = ?"
        ");";

    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(conn, sql.c_str(), -1, &stmt, 0);
    sqlite3_bind_text(stmt, 1, username.c_str(), -1, SQLITE_TRANSIENT);

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        int id = sqlite3_column_int(stmt, 0);
        int isGroup = sqlite3_column_int(stmt, 1);

        string finalName;

        if (isGroup == 1) {
            sqlite3_stmt* stmt2;
            string q = "SELECT name FROM conversations WHERE id = ?;";
            sqlite3_prepare_v2(conn, q.c_str(), -1, &stmt2, 0);
            sqlite3_bind_int(stmt2, 1, id);

            if (sqlite3_step(stmt2) == SQLITE_ROW) {
                finalName = (char*)sqlite3_column_text(stmt2, 0);
            }

            sqlite3_finalize(stmt2);
        } else {
            sqlite3_stmt* stmt2;
            string q =
                "SELECT username FROM conversation_users "
                "WHERE conversation_id = ? AND username != ? LIMIT 1;";

            sqlite3_prepare_v2(conn, q.c_str(), -1, &stmt2, 0);
            sqlite3_bind_int(stmt2, 1, id);
            sqlite3_bind_text(stmt2, 2, username.c_str(), -1, SQLITE_TRANSIENT);

            if (sqlite3_step(stmt2) == SQLITE_ROW) {
                finalName = (char*)sqlite3_column_text(stmt2, 0);
            }

            sqlite3_finalize(stmt2);
        }

        result.push_back(to_string(id) + "|" + finalName + "|" + to_string(isGroup));
    }

    sqlite3_finalize(stmt);
    return result;
}

//Finder Conversations
int Conversation::findConversation(vector<string> users) {
    sqlite3* conn = db.get();

    if (users.empty()) return -1;

    sort(users.begin(), users.end());

    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(conn,
        "SELECT conversation_id FROM conversation_users GROUP BY conversation_id",
        -1, &stmt, 0);

    int found = -1;

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        int convId = sqlite3_column_int(stmt, 0);

        vector<string> convUsers = getConversationUsers(convId);
        sort(convUsers.begin(), convUsers.end());

        if (convUsers == users) {
            found = convId;
            break;
        }
    }

    sqlite3_finalize(stmt);
    return found;
}