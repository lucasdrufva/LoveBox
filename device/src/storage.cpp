#include "storage.h"

void Storage::begin(){
    EEPROM.begin(EEPROM_SIZE);
}

void Storage::storePassword(String password){
    writeStringToEEPROM(EEPROM_OFFSET_PASS, password);
}

String Storage::getPassword(){
    return readStringFromEEPROM(EEPROM_OFFSET_PASS);
}

void Storage::writeStringToEEPROM(int addrOffset, const String &strToWrite) {
  byte len = strToWrite.length();
  EEPROM.write(addrOffset, len);
  for (int i = 0; i < len; i++) {
    EEPROM.write(addrOffset + 1 + i, strToWrite[i]);
  }

  EEPROM.commit();
}

String Storage::readStringFromEEPROM(int addrOffset) {
  int newStrLen = EEPROM.read(addrOffset);
  char data[newStrLen + 1];
  for (int i = 0; i < newStrLen; i++) {
    data[i] = EEPROM.read(addrOffset + 1 + i);
  }
  data[newStrLen] = '\0';
  return String(data);
}

String Storage::getChipId() {
  uint32_t chipId = 0;

  for (int i = 0; i < 17; i = i + 8) {
    chipId |= ((ESP.getEfuseMac() >> (40 - i)) & 0xff) << i;
  }

  return String(chipId);
}