#include "display.h"

extern Network network;

TaskHandle_t displayTaskHandle;

void displayTask(void *parameter)
{
    Serial.println("Starting display");
    Display display;
    display.begin();

    StatusUpdate status;
    vTaskDelay(1000 / portTICK_PERIOD_MS);

    for (;;)
    {
        if (ulTaskNotifyTake(pdTRUE, 0) != 0)
        {
            xSemaphoreTake(currentStatus_mutex, portMAX_DELAY);
            status = currentStatus;
            xSemaphoreGive(currentStatus_mutex);

            if (status.type == CONTENT_TYPE_TEXT)
            {
                String text = network.getText(status.contentId);
                Serial.println(text);
                display.setText(text);
            }
            else if (status.type == CONTENT_TYPE_IMAGE)
            {
                display.updateImage(status.contentId);
            }
            xTaskNotify(notifierTaskHandle, NOTIFICATION_EVENT_START, eSetValueWithOverwrite);

            //Simulate lid getting opened
            //vTaskDelay(5000 / portTICK_PERIOD_MS);
            //xTaskNotify(notifierTaskHandle, NOTIFICATION_EVENT_OPENED, eSetValueWithOverwrite);
        }
    }
}

void startDisplayTask()
{
    xTaskCreate(displayTask, "displayTask", 15000, NULL, 1, &displayTaskHandle);
}

void Display::begin()
{
    tft.begin();
}

void Display::setText(String text)
{
    tft.fillScreen(ILI9341_BLACK);
    tft.setCursor(0, 0);
    tft.setRotation(1);
    tft.println(text);
}

void Display::updateImage(int contentId)
{
    tft.fillScreen(ILI9341_BLACK);
    tft.setCursor(0, 0);
    tft.setRotation(1);
    for (int currentPart = 0; currentPart <= 31; currentPart++)
    {
        network.getImagePart(contentId, currentPart, onlineImage);
        Serial.println("draw");
        tft.drawRGBBitmap((currentPart % 8) * 40, ((currentPart - (currentPart % 8)) / 8) * 60, onlineImage, 40, 60);
        vTaskDelay(100 / portTICK_PERIOD_MS);
    }
}