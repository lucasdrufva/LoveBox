#pragma once
#include <Arduino.h>
#include <Adafruit_NeoPixel.h>

#include "lid.h"
#include "status.h"

#define NOTIFICATION_TYPE_RAINBOW 0

class Notifier{
public:
    void begin();
    void startNotifier(int notificationType);
    void rainbow();
    void clear();
    void fadeWhite();
private:
    Adafruit_NeoPixel strip = Adafruit_NeoPixel(12, 12, NEO_GRB + NEO_KHZ800);
};

void startNotifierTask();

extern TaskHandle_t notifierTaskHandle;

extern const BaseType_t NOTIFICATION_EVENT_START;
extern const BaseType_t NOTIFICATION_EVENT_OPENED;