#include "lid.h"

extern TaskHandle_t displayTaskHandle;
extern TaskHandle_t notifierTaskHandle;
extern Network network;

#define BACKLIGHT 26

void lidTask(void* parameter){
    bool lidOpen = false;
    int hallSensorValue;

    pinMode(BACKLIGHT, OUTPUT);
    pinMode(34, INPUT);

    for(;;){
        //hallSensorValue = analogRead(A2);
        //if(hallSensorValue < 3000){
        if(digitalRead(34)){
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
        digitalWrite(BACKLIGHT, lidOpen);
        vTaskDelay(100/portTICK_PERIOD_MS);
    }
}

void startLidTask()
{
    xTaskCreate(lidTask, "lidTask", 5000, NULL, 2, NULL);
}