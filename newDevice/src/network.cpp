#include "network.h"

extern Storage storage;

void Network::begin()
{
    WiFiManager wm;
    wm.autoConnect();
    delay(1000);
    Serial.println("ESP32 is connected to Wi-Fi network");

    authPassword = storage.getPassword();
    Serial.println("Stored Password: " + authPassword);

    if (!checkRegistred())
    {
        registerDevice();
    }
    Serial.println("Check again");
    checkRegistred();
}

void Network::registerDevice()
{
    HTTPClient http;

    http.begin("http://192.168.198.190:5000/device/register/" + storage.getChipId());

    int httpCode = http.POST("");

    if (httpCode == 201)
    { //Check for the returning code

        String payload = http.getString();
        Serial.println(httpCode);
        Serial.println(payload);

        authPassword = payload;

        storage.storePassword(authPassword);

        http.end();
    }
    else
    {
        Serial.println("Error on HTTP request");
    }

    http.end();
}

bool Network::checkRegistred()
{
    if ((WiFi.status() == WL_CONNECTED))
    { //Check the current connection status

        HTTPClient http;

        http.begin("http://192.168.198.190:5000/client");

        String auth = base64::encode(storage.getChipId() + ":" + authPassword);
        http.addHeader("Authorization", "Basic " + auth);

        int httpCode = http.GET();

        if (httpCode == 200)
        { //Check for the returning code

            String payload = http.getString();
            Serial.println(httpCode);
            Serial.println(payload);
            http.end();
            return true;
        }
        else
        {
            Serial.println("Error on HTTP request");
        }

        http.end();
    }
    return false;
}

StatusUpdate Network::getStatus()
{
    StatusUpdate message;
    HTTPClient http;

    http.begin("http://192.168.198.190:5000/device/status");

    String auth = base64::encode("14110864:" + authPassword);
    http.addHeader("Authorization", "Basic " + auth);

    Serial.println("Time to get something");

    int httpCode = http.GET();

    if (httpCode > 0)
    { //Check for the returning code

        String payload = http.getString();
        Serial.println(payload);

        DynamicJsonDocument doc(1024);

        deserializeJson(doc, payload);

        Serial.println("New message!");
        message.statusId = doc["id"];
        message.type = doc["type"];
        message.contentId = doc["contentId"];
        message.notifier = doc["notifier"];
    }
    else
    {
        Serial.println("Error on HTTP request");
    }

    http.end();
    return message;
}