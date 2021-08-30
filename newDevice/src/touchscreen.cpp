#include "touchscreen.h"

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
    bool screenTouched = false;

    for (;;)
    {
        if (getY() > 10)
        {
            if (!screenTouched)
            {
                screenTouched = true;
            }
            xTaskNotify(displayTaskHandle, DISPLAY_EVENT_TOUCHED, eSetValueWithOverwrite);
        }
        else
        {
            if (screenTouched)
            {
                screenTouched = false;
                xTaskNotify(displayTaskHandle, DISPLAY_EVENT_UNTOUCHED, eSetValueWithOverwrite);
            }
        }
        vTaskDelay(300 / portTICK_PERIOD_MS);
    }
}

void startTouchscreenTask()
{
    xTaskCreate(touchscreenTask, "touchscreenTask", 2048, NULL, 1, NULL);
}