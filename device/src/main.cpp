#include <Arduino.h>

#include <Wire.h>
#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>
#include <ArduinoJson.h>
#include <Adafruit_NeoPixel.h>
#include "TouchScreen.h"

//#include "image.h"

// For the Adafruit shield, these are the default.
#define TFT_DC 22
#define TFT_CS 21

// Use hardware SPI (on Uno, #13, #12, #11) and the above for CS/DC
Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC);
// If using the breakout, change pins as desired
//Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC, TFT_MOSI, TFT_CLK, TFT_RST, TFT_MISO);

// These are the four touchscreen analog pins
#define YP A7 // must be an analog pin, use "An" notation!
#define XP A9
#define XM 15 // must be an analog pin, use "An" notation!

#define YM 27 // can be a digital pin
 // can be a digital pin

TouchScreen ts = TouchScreen(15, 32, 33, 27, 277);

#include <WiFi.h>
#include <HTTPClient.h>

const char *ssid = "Hemma2020";
const char *password = "Almvagen66@";

String serverName = "http://192.168.198.190:5000";

uint16_t onlineImage[2400] = {0};

int latestMessageId = 0;

bool unseenMessage = false;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(12, 12, NEO_GRB + NEO_KHZ800);

void rainbow(int wait)
{
  for (long firstPixelHue = 0; firstPixelHue < 5 * 65536; firstPixelHue += 256)
  {
    for (int i = 0; i < strip.numPixels(); i++)
    {
      int pixelHue = firstPixelHue + (i * 65536L / strip.numPixels());
      strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue)));
    }
    strip.show();
    delay(wait);
  }
}

void clearStrip()
{
  for (int i = 0; i < strip.numPixels(); i++)
  {
    strip.setPixelColor(i, 0);
  }
  strip.show();
}

bool lidOpen()
{
  int raw = analogRead(A2);
  Serial.println(raw);
  if (raw < 3000)
  {
    return true;
  }
  return false;
}

void notifier(void *parameter)
{
  while (unseenMessage)
  { // infinite loop
    if (lidOpen())
    {
      unseenMessage = false;
      break;
    }
    rainbow(10);

    // Pause the task again for 500ms
    vTaskDelay(30 / portTICK_PERIOD_MS);
  }
  clearStrip();
  vTaskDelete(NULL);
}

void startNotifier()
{
  unseenMessage = true;
  xTaskCreate(
      notifier,   // Function that should be called
      "notifier", // Name of the task (for debugging)
      5000,       // Stack size (bytes)
      NULL,       // Parameter to pass
      1,          // Task priority
      NULL        // Task handle
  );
}

template <typename T, size_t N>
void byteToWord(uint8_t byteArray[], T (&wordArray)[N], int len)
{
  Serial.println("convert bytes to words");
  int j = 0;
  for (int i = 1; i < len; i += 2)
  {
    wordArray[j] = byteArray[i + 1] + (byteArray[i] << 8);
    j++;
  }
}

void downloadImage(int currentImage)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;

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
    // Free resources
    http.end();
  }
  else
  {
    Serial.println("WiFi Disconnected");
  }
}

void updateImage()
{
  tft.fillScreen(ILI9341_BLACK);
  tft.setCursor(0, 0);
  tft.setRotation(1);
  for (int currentImage = 0; currentImage <= 31; currentImage++)
  {
    downloadImage(currentImage);
    Serial.println("draw");
    tft.drawRGBBitmap((currentImage % 8) * 40, ((currentImage - (currentImage % 8)) / 8) * 60, onlineImage, 40, 60);
    delay(50);
  }
}

void setText(String text)
{
  tft.fillScreen(ILI9341_BLACK);
  tft.setCursor(0, 0);
  tft.setRotation(1);
  tft.println(text);
}

void checkForUpdate()
{
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;

    String serverPath = serverName + "/update";

    // Your Domain name with URL path or IP address with path
    http.begin(serverPath.c_str());

    // Send HTTP GET request
    int httpResponseCode = http.GET();

    if (httpResponseCode > 0)
    {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
      DynamicJsonDocument doc(1024);

      deserializeJson(doc, payload);

      if (latestMessageId != doc["id"])
      {
        Serial.println("Update!");
        latestMessageId = doc["id"];
        if (doc["latest"] == 0)
        {
          updateImage();
        }
        else
        {
          setText(doc["text"]);
        }
        startNotifier();
      }
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

  strip.begin();
  strip.show();
  strip.setBrightness(255);

  Serial.println("timeForLoop");
}

int getX()
{
  /*pinMode(YP, INPUT);
  pinMode(YM, INPUT);
  digitalWrite(YM, LOW);
  pinMode(XP, OUTPUT);
  digitalWrite(XP, HIGH);

  pinMode(XM, OUTPUT);
  digitalWrite(XM, LOW);

  return analogRead(YP);*/

  pinMode(XP, OUTPUT);
  digitalWrite(XP, HIGH);
  pinMode(XM, OUTPUT);
  digitalWrite(XM, LOW);

  pinMode(YM, OUTPUT);
  digitalWrite(YM, LOW);

  return analogRead(YP);
}

int getY()
{
  pinMode(YP, OUTPUT);
  digitalWrite(YP, HIGH);
  pinMode(YM, OUTPUT);
  digitalWrite(YM, LOW);

  pinMode(XM, OUTPUT);
  digitalWrite(XM, LOW);

  return analogRead(XP);
}

void loop(void)
{
  //checkForUpdate();
  //delay(10000);
  //rainbow(5);
  
  Serial.print("X: ");
  Serial.print(getX());
  Serial.print(" Y: ");
  Serial.println(getY());
  
  delay(500);
 
}
