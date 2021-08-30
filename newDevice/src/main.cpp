#include <Arduino.h>

#include "network.h"
#include "status.h"
#include "storage.h"
#include "display.h"
#include "notifier.h"
#include "touchscreen.h"

Storage storage;
Network network;

void setup() {
  currentStatus_mutex = xSemaphoreCreateMutex();

  Serial.begin(9600);

  storage.begin();

  delay(100);

  network.begin();

  delay(1000);

  Serial.println("ESP32 is connected to Wi-Fi network");

  startStatusTask();
  Serial.println("Status started");
  startNotifierTask();
  startDisplayTask();
  startLidTask();
  startTouchscreenTask();

}

void loop() {
  // put your main code here, to run repeatedly:

}