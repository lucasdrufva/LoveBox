package com.lovebox.server.controllers.user;

import com.lovebox.server.controllers.responses.DeviceResponse;
import com.lovebox.server.models.Device;
import com.lovebox.server.models.DeviceRepository;
import com.lovebox.server.models.User;
import com.lovebox.server.models.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class UserDeviceController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    DeviceRepository deviceRepository;

    @PostMapping("/user/device/{deviceName}")
    public void registerDevice(Principal principal, @PathVariable String deviceName){
        Optional<Device> maybeDevice = deviceRepository.findFirstByDeviceClientName(deviceName);
        if(!maybeDevice.isPresent()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Device device = maybeDevice.get();
        Optional<User> maybeUser = userRepository.findFirstByClientClientName(principal.getName());
        if(!maybeUser.isPresent()){
            //TODO: Throw unauthorized!
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        User user = maybeUser.get();

        device.getUsers().add(user);
        deviceRepository.save(device);
    }

    @GetMapping("/user/device")
    List<DeviceResponse> getDevices(Principal principal){
        Optional<User> maybeUser = userRepository.findFirstByClientClientName(principal.getName());
        if(!maybeUser.isPresent()){
            //TODO: Throw unauthorized!
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        User user = maybeUser.get();
        return user.getDevices().stream().map(DeviceResponse::fromDevice).collect(Collectors.toList());
    }
}
