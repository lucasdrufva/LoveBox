package com.lovebox.server.controllers.user;

import com.lovebox.server.controllers.requests.StatusTextRequest;
import com.lovebox.server.controllers.responses.StatusResponse;
import com.lovebox.server.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;
import java.util.Optional;

@RestController
public class UserStatusController {
    @Autowired
    TextRepository textRepository;

    @Autowired
    StatusRepository statusRepository;

    @Autowired
    DeviceRepository deviceRepository;

    @PostMapping("/user/device/{deviceName}/status/text")
    public StatusResponse postTextStatus(@RequestBody StatusTextRequest statusText, @PathVariable String deviceName){
        Text dbText = new Text(statusText.getText());
        Status status = new Status();
        status.setDate(new Date());
        status.setNotifier(statusText.getNotifier());
        status.setType(Status.TYPE_TEXT);
        status.setText(textRepository.save(dbText));

        Optional<Device> maybeDevice = deviceRepository.findFirstByDeviceClientName(deviceName);
        if(!maybeDevice.isPresent()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Device device = maybeDevice.get();
        status.setDevice(device);

        return StatusResponse.fromStatus(statusRepository.save(status));
    }

}
