#include "notifier.h"

const BaseType_t NOTIFICATION_EVENT_START = 0x01;
const BaseType_t NOTIFICATION_EVENT_OPENED = 0x02;

TaskHandle_t notifierTaskHandle;
TaskHandle_t rgbStripTaskHandle;

#define NUM_LEDS 12

Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, 12, NEO_GRB + NEO_KHZ800);

int previousPixel = 0;

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
    for (int i = 0; i < NUM_LEDS; i++)
    {
      int pixelHue = firstPixelHue + (i * 65536L / NUM_LEDS);
      strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(pixelHue)));
    }
    strip.show();
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

void snakeStrip()
{
  for (int i = 0; i < NUM_LEDS; i++)
  {
    for (int j = 0; j < NUM_LEDS; j++)
    {
      int currentPixel = 12 - i - j;
      if (currentPixel < 0)
      {
        currentPixel += 12;
      }
      strip.setPixelColor(currentPixel, 255 / ((j + 1) * 5), 255 / ((j + 1) * 5), 255 / ((j + 1) * 5));
    }
    strip.show();
    vTaskDelay(70 / portTICK_PERIOD_MS);
  }
}

void clearStrip()
{
  for (int i = 0; i < NUM_LEDS; i++)
  {
    strip.setPixelColor(i, 0);
  }
  strip.show();
}

void twinkleStrip()
{
  int pixel = 0;
  while (abs(pixel - previousPixel) < 3)
  {
    pixel = random(NUM_LEDS);
  }
  previousPixel = pixel;
  int off = random(0, 2);
  strip.setPixelColor(random(NUM_LEDS), off == 0 ? 0 : random(0, 255), off == 1 ? 0 : random(0, 255), off == 2 ? 0 : random(0, 255));
  strip.show();
  vTaskDelay(70 / portTICK_PERIOD_MS);
}

void rgbStripTask(void *parameter)
{
  for (;;)
  {
    switch (currentStatus.notifier)
    {
    case NOTIFICATION_TYPE_RAINBOW:
      rainbowStrip();
      break;
    case NOTIFICATION_TYPE_FLASH:
      fadeWhiteStrip();
      break;
    case NOTIFICATION_TYPE_TWINKLE:
      twinkleStrip();
      break;
    case NOTIFICATION_TYPE_SNAKE:
      snakeStrip();
      break;
    default:
      rainbowStrip();
      break;
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