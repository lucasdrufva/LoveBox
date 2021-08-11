#include "display.h"

void displayTask(void * parameter) {
  Serial.println("Starting display");
  for (;;) {
    StatusUpdate recievedMessage;
    if (xQueueReceive(messageQueue, &recievedMessage, portMAX_DELAY) == pdPASS) {
      Serial.print("Received = ");
      Serial.println(recievedMessage.contentId);
    }
    taskYIELD();
  }
}

void displayBegin(){
    xTaskCreate(displayTask, "displayTask", 2000, NULL, 1, NULL);
}