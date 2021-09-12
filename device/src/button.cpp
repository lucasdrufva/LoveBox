#include "button.h"

extern TaskHandle_t displayTaskHandle;

#define BTN_PIN 25

void buttonTask(void *parameter)
{
    pinMode(BTN_PIN, INPUT);
    for (;;)
    {
        if (digitalRead(BTN_PIN) == HIGH)
        {
            vTaskDelay(1000 / portTICK_PERIOD_MS);
            if (digitalRead(BTN_PIN) == HIGH)
            {
                xTaskNotify(displayTaskHandle, DISPLAY_EVENT_CONFIG, eSetValueWithOverwrite);
            }
        }
        vTaskDelay(500 / portTICK_PERIOD_MS);
    }
}

void startButtonTask()
{
    xTaskCreate(buttonTask, "buttonTask", 2048, NULL, 1, NULL);
}