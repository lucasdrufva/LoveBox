#pragma once
#include <Arduino.h>
#include <Wire.h>
#include <SPI.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ILI9341.h>

#include "status.h"
#include "notifier.h"

#define TFT_DC 22
#define TFT_CS 21

class Display
{
public:
    void begin();
    void setText(TextStatus text);
    void updateImage(int contentId);
private:
    Adafruit_ILI9341 tft = Adafruit_ILI9341(TFT_CS, TFT_DC);
    uint16_t onlineImage[2400] = {0};
};

void startDisplayTask();