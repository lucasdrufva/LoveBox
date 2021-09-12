#include "touchscreen.h"

extern Network network;

uint16_t touchedSize = 0;

#define YP A7
#define XP A9
#define XM 15
#define YM 27

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

void touchscreenTask(void *parameters)
{
    for (;;)
    {
        if (getY() > 100)
        {
            vTaskDelay(100/ portTICK_PERIOD_MS);
            if(getY() > 100){
                touchedSize++;
                xTaskNotify(displayTaskHandle, DISPLAY_EVENT_TOUCHED, eSetValueWithOverwrite);
            }
        }
        else
        {
            if (touchedSize > 0)
            {
                touchedSize = 0;
                xTaskNotify(displayTaskHandle, DISPLAY_EVENT_UNTOUCHED, eSetValueWithOverwrite);
                network.sendTouch(touchedSize);

            }
        }
        vTaskDelay(300 / portTICK_PERIOD_MS);
    }
}

void startTouchscreenTask()
{
    xTaskCreate(touchscreenTask, "touchscreenTask", 2048, NULL, 1, NULL);
}