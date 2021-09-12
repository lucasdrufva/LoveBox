#include "display.h"

extern Network network;
extern Storage storage;

TaskHandle_t displayTaskHandle;
StatusUpdate status;
Display display;

#include "SymbolFont.h"

void displayHandleNewStatus()
{
    xSemaphoreTake(currentStatus_mutex, portMAX_DELAY);
    status = currentStatus;
    xSemaphoreGive(currentStatus_mutex);

    if (status.type == CONTENT_TYPE_TEXT)
    {
        TextStatus text = network.getText(status.contentId);
        Serial.println(text.text);
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

void displayTask(void *parameter)
{
    Serial.println("Starting display");
    display.begin();

    vTaskDelay(1000 / portTICK_PERIOD_MS);

    uint32_t ulNotifiedValue;

    pinMode(26, OUTPUT);
    digitalWrite(26, HIGH);

    for (;;)
    {
        xTaskNotifyWait(
            0x00,
            ULONG_MAX,
            &ulNotifiedValue,
            10 / portTICK_PERIOD_MS);

        if ((ulNotifiedValue & DISPLAY_EVENT_NEW_STATUS) != 0)
        {
            displayHandleNewStatus();
        }

        if ((ulNotifiedValue & DISPLAY_EVENT_TOUCHED) != 0)
        {
            display.handleTouched();
        }

        if ((ulNotifiedValue & DISPLAY_EVENT_UNTOUCHED) != 0)
        {
            display.handleUnTouched();
        }

        if ((ulNotifiedValue & DISPLAY_EVENT_CONFIG) != 0)
        {
            display.handleShowConfig();
        }
    }
}

void startDisplayTask()
{
    xTaskCreate(displayTask, "displayTask", 20000, NULL, 1, &displayTaskHandle);
}

void Display::begin()
{
    tft.begin();
    tft.setRotation(1);    
}

void Display::handleTouched(){
    Serial.println("touched!");
    tft.setFont(&SymbolFont);
    tft.drawChar(160,120,0,ILI9341_PINK,ILI9341_BLACK,touchedSize);
    touchedSize++;
}

void Display::handleUnTouched(){
    touchedSize = 0;
    tft.fillScreen(ILI9341_BLACK);
}

void Display::handleShowConfig(){
    tft.fillScreen(0x00);
    tft.setCursor(0, 0);
    tft.setRotation(1);
    tft.setTextColor(ULONG_MAX);
    tft.setTextSize(2);
    tft.println("Enter this code:");
    tft.println(storage.getChipId());
}

void Display::setText(TextStatus text)
{
    tft.fillScreen(text.backgroundColor);
    tft.setCursor(0, 0);
    tft.setRotation(1);
    tft.setTextColor(text.color);
    tft.setTextSize(text.size);
    tft.println(text.text);
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
        //vTaskDelay(100 / portTICK_PERIOD_MS);
    }
}