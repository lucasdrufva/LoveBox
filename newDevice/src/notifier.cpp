#include "notifier.h"

QueueHandle_t lidOpenQueue;
extern Notifier notifier;

void Notifier::begin()
{
  lidOpenQueue = xQueueCreate(2, sizeof(int));
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
    delay(15);
  }
  for (int i = 256; i > 0; i--)
  {
    strip.fill(strip.Color(i, i, i, i));
    strip.show();
    delay(15);
  }
}

void Notifier::rainbow()
{
  for (long firstPixelHue = 0; firstPixelHue < 5 * 65536; firstPixelHue += 256)
  {
    for (int i = 0; i < strip.numPixels(); i++)
    {
      int pixelHue = firstPixelHue + (i * 65536L / strip.numPixels());
      strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue)));
    }
    strip.show();
    delay(10);
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

void notifierTask(void *parameter)
{
  int notificationType = (int)parameter;
  for (;;)
  {
    if (notificationType == 0)
    {
      notifier.rainbow();
    }
    int recievedData;
    if (xQueueReceive(lidOpenQueue, &recievedData, 0) == pdPASS)
    {
      notifier.fadeWhite();
      notifier.clear();
      vTaskDelete(NULL);
      break;
    }
  }
}

void Notifier::startNotifier(int notificationType)
{
  xTaskCreate(notifierTask, "notifierTask", 1000, (void *)notificationType, 1, NULL);
}