#pragma once
#include <Arduino.h>
#include <EEPROM.h>

#define EEPROM_SIZE 10
#define EEPROM_OFFSET_PASS 0

class Storage{
public:
    void begin();
    void storePassword(String password);
    String getPassword();
    String getChipId();
private:
    void writeStringToEEPROM(int addrOffset, const String &strToWrite);
    String readStringFromEEPROM(int addrOffset);
};