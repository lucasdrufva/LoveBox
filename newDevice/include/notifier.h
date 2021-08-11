#pragma once
#include <Arduino.h>
#include <Adafruit_NeoPixel.h>

class Notifier{
public:
    void begin();
    void rainbow();
    void clear();
    void startNotifier(int notificationType);
private:
    Adafruit_NeoPixel strip = Adafruit_NeoPixel(12, 12, NEO_GRB + NEO_KHZ800);
};