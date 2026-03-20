#pragma once

class BaseEntity {
private:
    //Attribute
    int id;
public:
    //Constructor
    BaseEntity(int id = 0);

    //Getter
    int getID() const;

    //Setter
    void setID(int id);
};