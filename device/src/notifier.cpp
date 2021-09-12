#include "notifier.h"

const BaseType_t NOTIFICATION_EVENT_START = 0x01;
const BaseType_t NOTIFICATION_EVENT_OPENED = 0x02;

TaskHandle_t notifierTaskHandle;
TaskHandle_t rgbStripTaskHandle;

Adafruit_NeoPixel strip = Adafruit_NeoPixel(12, 12, NEO_GRB + NEO_KHZ800);

void fadeWhiteStrip()
{
  for (int i = 0; i < 256; i++)
  {
    strip.fill(strip.Color(i, i, i, i));
    strip.show();
    vTaskDelay(1 / portTICK_PERIOD_MS);
  }
  for (int i = 256; i > 0; i--)
  {
    strip.fill(strip.Color(i, i, i, i));
    strip.show();
    vTaskDelay(1 / portTICK_PERIOD_MS);
  }
}

void rainbowStrip()
{
  for (long firstPixelHue = 0; firstPixelHue < 5 * 65536; firstPixelHue += 512)
  {
    for (int i = 0; i < strip.numPixels(); i++)
    {
      int pixelHue = firstPixelHue + (i * 65536L / strip.numPixels());
      strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue)));
    }
    strip.show();
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

void clearStrip()
{
  for (int i = 0; i < strip.numPixels(); i++)
  {
    strip.setPixelColor(i, 0);
  }
  strip.show();
}

void rgbStripTask(void *parameter)
{
  for (;;)
  {
    if (currentStatus.notifier == NOTIFICATION_TYPE_RAINBOW)
    {
      rainbowStrip();
    }
  }

  vTaskDelay(10 / portTICK_PERIOD_MS);
}

void notifierTask(void *parameter)
{
  strip.begin();
  strip.setBrightness(255);

  uint32_t ulNotifiedValue;
  for (;;)
  {
    xTaskNotifyWait(
        0x00,
        ULONG_MAX,
        &ulNotifiedValue,
        10 / portTICK_PERIOD_MS);

    if ((ulNotifiedValue & NOTIFICATION_EVENT_START) != 0)
    {
      if (rgbStripTaskHandle == NULL)
      {
        xTaskCreate(rgbStripTask, "RGB Strip Task", 1024, NULL, 2, &rgbStripTaskHandle);
      }
    }

    if ((ulNotifiedValue & NOTIFICATION_EVENT_OPENED) != 0)
    {
      if (rgbStripTaskHandle != NULL)
      {
        vTaskDelete(rgbStripTaskHandle);
        rgbStripTaskHandle = NULL;
        Serial.println("Opened");
        fadeWhiteStrip();
        clearStrip();
      }
    }
  }
}

void startNotifierTask()
{
  xTaskCreate(notifierTask, "Notifier Task", 1024, NULL, 1, &notifierTaskHandle);
}