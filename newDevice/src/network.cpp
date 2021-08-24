#include "network.h"

extern Storage storage;

void Network::begin()
{
    WiFiManager wm;
    wm.autoConnect();
    delay(1000);
    Serial.println("ESP32 is connected to Wi-Fi network");

    auth = "Basic " + base64::encode(storage.getChipId() + ":" + storage.getPassword());

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

        storage.storePassword(payload);
        auth = "Basic " + base64::encode(storage.getChipId() + ":" + payload);
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
        http.addHeader("Authorization", auth);

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
    http.addHeader("Authorization", auth);

    int httpCode = http.GET();

    if (httpCode == 200)
    { //Check for the returning code
        String payload = http.getString();

        DynamicJsonDocument doc(1024);

        deserializeJson(doc, payload);

        message.statusId = doc["id"];
        message.type = doc["type"];
        message.contentId = doc["contentId"];
        message.notifier = doc["notifier"];
    }
    else
    {
        message.statusId = 0;
        Serial.println("Error on HTTP request");
    }

    http.end();
    return message;
}

String Network::getText(int contentId){
    String text = "";
    HTTPClient http;

    http.begin("http://192.168.198.190:5000/text/" + String(contentId));
    http.addHeader("Authorization", auth);

    int httpCode = http.GET();

    if (httpCode == 200)
    { //Check for the returning code
        String payload = http.getString();

        DynamicJsonDocument doc(1024);

        deserializeJson(doc, payload);

        text = doc["text"].as<String>();
        
    }
    else
    {
        Serial.println("Error on HTTP request");
    }

    http.end();
    return text;
}

//template <typename T, size_t N>
void byteToWord(uint8_t byteArray[], uint16_t* wordArray, int len)
{
  Serial.println("convert bytes to words");
  int j = 0;
  for (int i = 1; i < len; i += 2)
  {
    wordArray[j] = byteArray[i + 1] + (byteArray[i] << 8);
    j++;
  }
}

//template <typename T, size_t N>
void Network::getImagePart(int contentId, int part, uint16_t* onlineImage){
    HTTPClient http;

    // Your Domain name with URL path or IP address with path
    http.begin("http://192.168.198.190:5000/image/" + String(contentId) + "/part/" + String(part));

    // Send HTTP GET request
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0)
    {
      Serial.println(part);
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      WiFiClient &stream = http.getStream();
      uint8_t testIn[4800] = {0};
      stream.readBytes(testIn, 4800);
      byteToWord(testIn, onlineImage, 4800);
    }
    else
    {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
}

void Network::reportSeen(int statusId){
    HTTPClient http;

    http.begin("http://192.168.198.190:5000/device/status/" + String(statusId) + "/seen");
    http.addHeader("Authorization", auth);

    int httpCode = http.PUT("");

    if (httpCode == 200){
        Serial.println("Opened reported");
    }else {
        Serial.println("Failed to report openenig");
    }
}