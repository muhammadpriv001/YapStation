#include "Engine.hpp"

using namespace std;

// ======================
// CONSTRUCTOR
// ======================

Engine::Engine() : db("yap.db"), user(db), conversation(db), message(db) {

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

    db.execute(
        "CREATE TABLE IF NOT EXISTS conversations ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "name TEXT,"
        "is_group INTEGER);"
    );

    db.execute(
        "CREATE TABLE IF NOT EXISTS conversation_users ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "conversation_id INTEGER NOT NULL,"
        "username TEXT NOT NULL,"
        "UNIQUE(conversation_id, username)"
        ");"
    );

    db.execute(
        "CREATE TABLE IF NOT EXISTS messages ("
        "id INTEGER PRIMARY KEY AUTOINCREMENT,"
        "conversation_id INTEGER,"
        "sender_username TEXT,"
        "content TEXT,"
        "type TEXT,"
        "media_path TEXT,"
        "timestamp INTEGER);"
    );
}

// ======================
// AUTH
// ======================

//User Registration
void Engine::registerUser(string fn, string ln, string gender, string uname, string email, string pass) {
    user.registerUser(fn, ln, gender, uname, email, pass);
}

//User Login
bool Engine::login(string username, string password) {
    return user.login(username, password);
}

// ======================
// USERS
// ======================

//Getting All Users
vector<string> Engine::getAllUsers() {
    return user.getAllUsers();
}

// ======================
// CONVERSATIONS
// ======================

//Creating Conversations
int Engine::createConversation(vector<string> users, bool isGroup, string name) {
    return conversation.createConversation(users, isGroup, name);
}

//Getter User Conversations
vector<string> Engine::getUserConversations(string username) {
    return conversation.getUserConversations(username);
}

//Getter Conversation Users
vector<string> Engine::getConversationUsers(int conversationId) {
    return conversation.getConversationUsers(conversationId);
}

//Finder Conversations
int Engine::findConversation(vector<string> users) {
    return conversation.findConversation(users);
}

// ======================
// MESSAGES
// ======================

//Send Message
void Engine::sendMessage(string sender, int conversationId, string content, string type, string mediaPath) {
    message.sendMessage(sender, conversationId, content, type, mediaPath);
}

//Getting Message
vector<string> Engine::getMessages(int convoId) {
    return message.getMessages(convoId);
}