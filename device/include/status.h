#pragma once
#include <Arduino.h>

#include "network.h"
#include "display.h"

#define CONTENT_TYPE_IMAGE 0
#define CONTENT_TYPE_TEXT 1

typedef struct StatusUpdate
{
    uint32_t statusId;
    uint16_t type;
    uint16_t notifier;
    uint32_t contentId;
};

typedef struct TextStatus
{
    String text;
    uint16_t color;
    uint16_t backgroundColor;
    uint8_t size;
};

extern StatusUpdate currentStatus;
extern SemaphoreHandle_t currentStatus_mutex;
void startStatusTask();