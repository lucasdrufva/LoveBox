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

class Network
{
public:
    void begin();
    StatusUpdate getStatus();
    String getText(int contentId);
    //template <typename T, size_t N>
    void getImagePart(int contentId, int part, uint16_t* onlineImage);
private:
    String auth;
    void registerDevice();
    bool checkRegistred();
};