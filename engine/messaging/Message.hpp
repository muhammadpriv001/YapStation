#pragma once

//Includes
#include "../Database.hpp"
#include <string>
#include <vector>

using namespace std;

class Message {
private:
    //Database Instance
    Database& db;

public:
    //Constructor
    Message(Database& database);

    //===========================
    //FUNCTIONALITY
    //===========================

    //Send Message
    void sendMessage(string sender, int conversationId, string content, string type, string mediaPath = "");

    //Get Message
    vector<string> getMessages(int conversationId);
};