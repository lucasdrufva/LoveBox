#pragma once
#include <Arduino.h>

#include "network.h"

#define CONTENT_TYPE_IMAGE 0
#define CONTENT_TYPE_TEXT 1

typedef struct StatusUpdate
{
    uint32_t statusId;
    uint16_t type;
    uint16_t notifier;
    uint32_t contentId;
};

extern StatusUpdate currentStatus;
extern SemaphoreHandle_t currentStatus_mutex;
void startStatusTask();