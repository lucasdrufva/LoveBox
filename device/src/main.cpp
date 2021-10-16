#include <Arduino.h>

#include "network.h"
#include "status.h"
#include "storage.h"
#include "display.h"
#include "notifier.h"
#include "touchscreen.h"
#include "button.h"

Storage storage;
Network network;

void setup() {
  currentStatus_mutex = xSemaphoreCreateMutex();

  Serial.begin(9600);

  storage.begin();
  startDisplayTask();

  delay(100);

  network.begin();

  delay(1000);

  startStatusTask();
  Serial.println("Status started");
  startNotifierTask();
  startLidTask();
  startTouchscreenTask();
  startButtonTask();

}

void loop() {
  // put your main code here, to run repeatedly:
  vTaskDelay(1000 / portTICK_PERIOD_MS);
}