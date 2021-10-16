#pragma once
#include <Arduino.h>
#include <Adafruit_NeoPixel.h>

#include "lid.h"
#include "status.h"

#define NOTIFICATION_TYPE_RAINBOW 0
#define NOTIFICATION_TYPE_FLASH 1
#define NOTIFICATION_TYPE_SNAKE 2
#define NOTIFICATION_TYPE_TWINKLE 3

void startNotifierTask();

extern TaskHandle_t notifierTaskHandle;

extern const BaseType_t NOTIFICATION_EVENT_START;
extern const BaseType_t NOTIFICATION_EVENT_OPENED;