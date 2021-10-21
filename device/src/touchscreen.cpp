#include "touchscreen.h"

extern Network network;

uint16_t touchedSize = 0;

#define YP A7
#define XP A9
#define XM 15
#define YM 27

int getX()
{
    pinMode(XP, OUTPUT);
    digitalWrite(XP, HIGH);
    pinMode(XM, OUTPUT);
    digitalWrite(XM, LOW);

    pinMode(YM, OUTPUT);
    digitalWrite(YM, LOW);

    return analogRead(YP);
}

void touchscreenTask(void *parameters)
{
    for (;;)
    {
        if (getX() > 200)
        {
            vTaskDelay(100 / portTICK_PERIOD_MS);
            if (getX() > 200)
            {
                touchedSize++;
                xTaskNotify(displayTaskHandle, DISPLAY_EVENT_TOUCHED, eSetValueWithOverwrite);
            }
            else
            {
                continue;
            }
        }
        else
        {
            if (touchedSize > 1)
            {
                xTaskNotify(displayTaskHandle, DISPLAY_EVENT_UNTOUCHED, eSetValueWithOverwrite);
                network.sendTouch(touchedSize);
                touchedSize = 0;
            }
            else if (touchedSize > 0)
            {
                touchedSize = 0;
                xTaskNotify(displayTaskHandle, DISPLAY_EVENT_NEW_STATUS, eSetValueWithOverwrite);
            }
        }
        vTaskDelay(250 / portTICK_PERIOD_MS);
    }
}

void startTouchscreenTask()
{
    xTaskCreate(touchscreenTask, "touchscreenTask", 2048, NULL, 1, NULL);
}