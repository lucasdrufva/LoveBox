#include "status.h"

extern Network network;

extern TaskHandle_t displayTaskHandle;
StatusUpdate currentStatus;
SemaphoreHandle_t currentStatus_mutex;

void statusTask(void* parameters){
    for(;;){
        StatusUpdate status = network.getStatus();
        if(status.statusId != currentStatus.statusId && status.statusId != 0){
            if(xSemaphoreTake( currentStatus_mutex, portMAX_DELAY ) == pdPASS ){
                currentStatus = status;
                xTaskNotifyGive(displayTaskHandle);
                xSemaphoreGive(currentStatus_mutex);
            }
        }
        vTaskDelay(5000/portTICK_PERIOD_MS);
    }
}


void startStatusTask(){
    xTaskCreate(statusTask, "statusTask", 5000, NULL, 1, NULL);
}