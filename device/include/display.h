#pragma once
#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>

#include "status.h"
#include "notifier.h"
#include "touchscreen.h"

#define TFT_DC 22
#define TFT_CS 21

#define DISPLAY_EVENT_NEW_STATUS 0x01
#define DISPLAY_EVENT_TOUCHED 0x02
#define DISPLAY_EVENT_UNTOUCHED 0x04
#define DISPLAY_EVENT_CONFIG 0x08

struct TextStatus;

class Display
{
public:
    void begin();
    void setText(TextStatus text);
    void updateImage(int contentId);
    void handleTouched();
    void handleUnTouched();
    void handleShowConfig();
private:
    Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC);
    uint16_t onlineImage[2400] = {0};
};

void startDisplayTask();

extern TaskHandle_t displayTaskHandle;