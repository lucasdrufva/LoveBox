#include <Arduino.h>

#include <Wire.h>
#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>

//#include "image.h"

// For the Adafruit shield, these are the default.
#define TFT_DC 22
#define TFT_CS 21

// Use hardware SPI (on Uno, #13, #12, #11) and the above for CS/DC
Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC);
// If using the breakout, change pins as desired
//Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_MOSI, TFT_CLK, TFT_RST, TFT_MISO);

#include <WiFi.h>
#include <HTTPClient.h>

const char *ssid = "Hemma2020";
const char *password = "Almvagen66@";

String serverName = "http://192.168.198.16:5000";

int currentImage = 31;

uint16_t onlineImage[2400] = {0}; 

template<typename T, size_t N>
void byteToWord(uint8_t byteArray[], T (&wordArray)[N], int len){
  Serial.println("convert bytes to words");
  int j = 0;
  for(int i = 1; i < len; i+=2){
    wordArray[j] = byteArray[i+1]+(byteArray[i]<<8);
    j++;
  }

}

void setup()
{
  Serial.begin(9600);
  Serial.println("ILI9341 Test!");

  tft.begin();

  WiFi.begin(ssid, password);
  Serial.println("Connecting");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

  Serial.println("Timer set to 5 seconds (timerDelay variable), it will take 5 seconds before publishing the first reading.");

  uint8_t testIn[4] = {0xff, 0xaa, 0xbb, 0xcc};
  uint16_t testOut[2] = {0};
  //testOut = 
  //Serial.println(testOut[0]);
  byteToWord(testIn, testOut, 4);
  Serial.println(testOut[0]);

  Serial.println("timeForLoop");
  tft.fillScreen(ILI9341_BLACK);
}

void loop(void)
{
  Serial.println("fill screen");
  //tft.fillScreen(ILI9341_BLACK);
  tft.setCursor(0, 0);
  tft.setRotation(1);
  //tft.setTextColor(ILI9341_WHITE);  tft.setTextSize(3);
  //tft.println("Hello World!");
  Serial.println("draw");
  tft.drawRGBBitmap((currentImage%8)*40, ((currentImage-(currentImage%8))/8)*60, onlineImage, 40, 60);
  delay(300);
  //Check WiFi connection status
  //Check WiFi connection status
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;

    currentImage++;
    if(currentImage > 31){
      currentImage = 0;
    }

    String serverPath = serverName + "/download/" + String(currentImage);

    // Your Domain name with URL path or IP address with path
    http.begin(serverPath.c_str());

    // Send HTTP GET request
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0)
    {
      Serial.println(currentImage);
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      WiFiClient& stream = http.getStream();
      uint8_t testIn[4800] = {0};
      stream.readBytes(testIn, 4800);
      byteToWord(testIn, onlineImage, 4800);
    }
    else
    {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    // Free resources
    http.end();
  }
  else
  {
    Serial.println("WiFi Disconnected");
  }
}
