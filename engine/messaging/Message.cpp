//Includes
#include "Message.hpp"
#include <ctime>

using namespace std;

//Constructor
Message::Message(Database& database) : db(database) {}

//===========================
//FUNCTIONALITY
//===========================

//Send Message
void Message::sendMessage(string sender, int conversationId, string content, string type, string mediaPath) {
    sqlite3* conn = db.get();
    long timestamp = time(0);

    string sql =
        "INSERT INTO messages (conversation_id, sender_username, content, type, media_path, timestamp) VALUES ("
        + to_string(conversationId) + ", '"
        + sender + "', '"
        + content + "', '"
        + type + "', '"
        + mediaPath + "', "
        + to_string(timestamp) + ");";

    sqlite3_exec(conn, sql.c_str(), 0, 0, 0);
}

//Get Message
vector<string> Message::getMessages(int conversationId) {
    sqlite3* conn = db.get();
    vector<string> result;

    string sql =
        "SELECT sender_username, content, type, media_path, timestamp "
        "FROM messages WHERE conversation_id = "
        + to_string(conversationId) +
        " ORDER BY timestamp ASC;";

    sqlite3_stmt* stmt;
    sqlite3_prepare_v2(conn, sql.c_str(), -1, &stmt, 0);

    while (sqlite3_step(stmt) == SQLITE_ROW) {
        string sender = (char*)sqlite3_column_text(stmt, 0);
        string content = (char*)sqlite3_column_text(stmt, 1);
        string type = (char*)sqlite3_column_text(stmt, 2);
        string media = (char*)sqlite3_column_text(stmt, 3);
        long timestamp = sqlite3_column_int64(stmt, 4);

        result.push_back(
            sender + "|" +
            content + "|" +
            type + "|" +
            media + "|" +
            to_string(timestamp)
        );
    }

    sqlite3_finalize(stmt);
    return result;
}