#include "lid.h"

extern TaskHandle_t displayTaskHandle;
extern TaskHandle_t notifierTaskHandle;
extern Network network;

void lidTask(void* parameter){
    bool lidOpen = false;
    int hallSensorValue;

    for(;;){
        hallSensorValue = analogRead(A2);
        if(hallSensorValue < 3000){
            if(!lidOpen){
                lidOpen = true;
                xTaskNotify(notifierTaskHandle, NOTIFICATION_EVENT_OPENED, eSetValueWithOverwrite);
            }
        }else {
            if(lidOpen){
                lidOpen = false;
                //Report seen after lid closed to not get a new status update while lid open
                network.reportSeen(currentStatus.statusId);
            }
            
        }
        vTaskDelay(100/portTICK_PERIOD_MS);
    }
}

void startLidTask()
{
    xTaskCreate(lidTask, "lidTask", 5000, NULL, 1, NULL);
}