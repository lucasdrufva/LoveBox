#include "notifier.h"

const BaseType_t NOTIFICATION_EVENT_START = 0x01;
const BaseType_t NOTIFICATION_EVENT_OPENED = 0x02;

TaskHandle_t notifierTaskHandle;

void Notifier::begin()
{
  strip.begin();
  strip.show();
  strip.setBrightness(255);
}

void Notifier::fadeWhite()
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

void Notifier::rainbow()
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

void Notifier::clear()
{
  for (int i = 0; i < strip.numPixels(); i++)
  {
    strip.setPixelColor(i, 0);
  }
  strip.show();
}

void runNotifier()
{
}

void notifierTask(void *parameter)
{
  Notifier notifier;
  notifier.begin();
  uint32_t ulNotifiedValue;
  for (;;)
  {
    xTaskNotifyWait(
        0x00,
        0x00,
        &ulNotifiedValue,
        10 / portTICK_PERIOD_MS);

    if ((ulNotifiedValue & NOTIFICATION_EVENT_START) != 0)
    {
      if (currentStatus.notifier == NOTIFICATION_TYPE_RAINBOW)
      {
        Serial.println("Rainbow!");
        notifier.rainbow();
      }
    }

    if ((ulNotifiedValue & NOTIFICATION_EVENT_OPENED) != 0)
    {
      //Clear state
      xTaskNotify(notifierTaskHandle, 0x00, eSetValueWithOverwrite);

      Serial.println("Opened");
      notifier.fadeWhite();
      notifier.clear();
    }
  }
}

void startNotifierTask()
{
  xTaskCreate(notifierTask, "Notifier Task", 1024, NULL, 1, &notifierTaskHandle);
}