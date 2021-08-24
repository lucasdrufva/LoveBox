package com.lovebox.server.controllers.device;

import com.lovebox.server.controllers.responses.StatusResponse;
import com.lovebox.server.models.Device;
import com.lovebox.server.models.DeviceRepository;
import com.lovebox.server.models.Status;
import com.lovebox.server.models.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.Optional;

@RestController
public class DeviceStatusController {
    @Autowired
    DeviceRepository deviceRepository;

    @Autowired
    StatusRepository statusRepository;

    @GetMapping("/device/status")
    StatusResponse getStatus(Principal principal){
        Optional<Device> maybeDevice = deviceRepository.findFirstByDeviceClientName(principal.getName());
        if(!maybeDevice.isPresent()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Device device = maybeDevice.get();

        Optional<Status> currentStatus = statusRepository.findFirstByDeviceAndSeenFalseOrderByDateAsc(device);

        if(currentStatus.isPresent()){
            return StatusResponse.fromStatus(currentStatus.get());
        }else {
            return null;
        }
    }

    @PutMapping("/device/status/{statusId}/seen")
    void putStatusSeen(Principal principal, @PathVariable Long statusId){
        Optional<Status> maybeStatus = statusRepository.findById(statusId);
        if(!maybeStatus.isPresent()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Status status = maybeStatus.get();
        status.setSeen(true);
        statusRepository.save(status);
    }
}
