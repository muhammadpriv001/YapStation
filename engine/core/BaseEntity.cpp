//Includes
#include "BaseEntity.hpp"

//Constructor
BaseEntity::BaseEntity(int id) {
    this->id = id;
}

//Getter
int BaseEntity::getID() const {
    return id;
}

//Setter
void BaseEntity::setID(int id) {
    this->id = id;
}