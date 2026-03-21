#pragma once

//Includes
#include "../Database.hpp"
#include <vector>
#include <string>

using namespace std;

class Conversation {
private:
    //Database Instance
    Database& db;

public:
    //Constructor
    Conversation(Database& database);

    //===========================
    //FUNCTIONALITY
    //===========================

    //Conversation Creator
    int createConversation(vector<string> users, bool isGroup, string name);

    //Getter User Conversations
    vector<string> getUserConversations(string username);

    //Getter Conversations Users
    vector<string> getConversationUsers(int conversationId);

    //Finder Conversations
    int findConversation(vector<string> users);
};