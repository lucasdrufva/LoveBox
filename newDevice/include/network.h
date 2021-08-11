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

private:
    String authPassword = "secret";
    void registerDevice();
    bool checkRegistred();
};