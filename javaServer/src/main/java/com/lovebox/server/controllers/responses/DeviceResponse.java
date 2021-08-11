package com.lovebox.server.controllers.responses;

import com.lovebox.server.models.Device;
import com.lovebox.server.models.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class DeviceResponse {
    private Long id;
    private String name;

    public static DeviceResponse fromDevice(Device device){
        return new DeviceResponse(device.getId(), device.getDevice().getClientName());
    }
}
