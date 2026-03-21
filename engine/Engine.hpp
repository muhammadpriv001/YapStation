#pragma once

//Includes
#include "../Database.hpp"
#include "user/User.hpp"
#include "messaging/Conversation.hpp"
#include "messaging/Message.hpp"

using namespace std;

class Engine {
private:
    //Database Instance
    Database db;

    //Classes
    User user;
    Conversation conversation;
    Message message;

public:
    //Constructor
    Engine();

    // ======================
    // AUTH
    // ======================

    //User Registration
    void registerUser(string fn, string ln, string gender, string uname, string email, string pass);

    //User Login
    bool login(string username, string password);

    // ======================
    // USERS
    // ======================

    vector<string>  getAllUsers();

    // ======================
    // CONVERSATIONS
    // ======================

    //Create Conversation
    int createConversation(vector<string> users, bool isGroup, string name);

    //Getter User Conversations
    vector<string> getUserConversations(string username);

    //Getter Conversation Users
    vector<string> getConversationUsers(int conversationId);

    //Finder Conversations
    int findConversation(vector<string> users);

    // ======================
    // MESSAGES
    // ======================

    //Send Messages
    void sendMessage(string sender, int conversationId, string content, string type, string mediaPath = "");

    //Getting Messages
    vector<string>  getMessages(int convoId);
};