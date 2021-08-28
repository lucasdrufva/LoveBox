#pragma once
#include <Arduino.h>
#include <WiFi.h>
#include <WiFiManager.h>
#include "HTTPClient.h"
#include "base64.h"
#include <ArduinoJson.h>

#include "storage.h"
#include "status.h"

struct StatusUpdate;
struct TextStatus;

class Network
{
public:
    void begin();
    StatusUpdate getStatus();
    TextStatus getText(int contentId);
    //template <typename T, size_t N>
    void getImagePart(int contentId, int part, uint16_t* onlineImage);
    void reportSeen(int statusId);
private:
    String auth;
    void registerDevice();
    bool checkRegistred();
};