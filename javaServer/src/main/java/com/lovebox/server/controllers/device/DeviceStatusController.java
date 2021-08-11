package com.lovebox.server.controllers.device;

import com.lovebox.server.controllers.responses.StatusResponse;
import com.lovebox.server.models.Device;
import com.lovebox.server.models.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.Optional;

@RestController
public class DeviceStatusController {
    @Autowired
    DeviceRepository deviceRepository;

    @GetMapping("/device/status")
    StatusResponse getStatus(Principal principal){
        Optional<Device> maybeDevice = deviceRepository.findFirstByDeviceClientName(principal.getName());
        if(!maybeDevice.isPresent()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Device device = maybeDevice.get();
        if(device.getStatuses().size() > 0){
            return StatusResponse.fromStatus(device.getStatuses().get(device.getStatuses().size()-1));
        }else {
            return null;
        }
    }
}
