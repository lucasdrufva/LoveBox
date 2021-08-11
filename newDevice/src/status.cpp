#include "status.h"

QueueHandle_t messageQueue;

extern Network network;

int latestId = 0;

void statusTask(void* parameters){
    for(;;){
        StatusUpdate status = network.getStatus();
        if(status.statusId != latestId){
            latestId = status.statusId;
            xQueueSend( messageQueue, &status, portMAX_DELAY );
        }
        vTaskDelay(5000/portTICK_PERIOD_MS);
    }
}


void statusBegin(){
    messageQueue = xQueueCreate(4, sizeof(StatusUpdate));
    xTaskCreate(statusTask, "statusTask", 5000, NULL, 1, NULL);
}