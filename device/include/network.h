#pragma once
#include <Arduino.h>
#include <WiFi.h>
#include <WiFiManager.h>
#include "HTTPClient.h"
#include "base64.h"
#include <ArduinoJson.h>

#include "storage.h"
#include "status.h"

const String baseUrl = "http://192.168.198.190:5000";

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
    void sendTouch(int size);
private:
    String auth;
    void registerDevice();
    bool checkRegistred();
    static void configWifiCallback (WiFiManager *myWiFiManager);
    WiFiManager wm;
};