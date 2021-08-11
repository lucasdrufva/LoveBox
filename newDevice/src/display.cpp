#include "display.h"

extern Network network;
extern Display display;

void displayTask(void *parameter)
{
    Serial.println("Starting display");
    for (;;)
    {
        StatusUpdate recievedMessage;
        if (xQueueReceive(messageQueue, &recievedMessage, portMAX_DELAY) == pdPASS)
        {
            Serial.print("Received = ");
            Serial.println(recievedMessage.contentId);
            if (recievedMessage.type == 1)
            {
                String text = network.getText(recievedMessage.contentId);
                Serial.println(text);
                display.setText(text);
            }else if(recievedMessage.type == 0){
                display.updateImage(recievedMessage.contentId);
            }
        }
        taskYIELD();
    }
}

void startDisplayTask()
{
    xTaskCreate(displayTask, "displayTask", 10000, NULL, 1, NULL);
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
        delay(100);
    }
}