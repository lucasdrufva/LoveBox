#pragma once
#include <Arduino.h>

#include "network.h"

typedef struct StatusUpdate
{
    int statusId;
    int type;
    int notifier;
    int contentId;
};


extern QueueHandle_t messageQueue;
void statusBegin();