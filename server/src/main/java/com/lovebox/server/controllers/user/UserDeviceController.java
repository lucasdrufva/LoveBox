package com.lovebox.server.controllers.user;

import com.lovebox.server.controllers.responses.DeviceResponse;
import com.lovebox.server.models.Device;
import com.lovebox.server.models.DeviceRepository;
import com.lovebox.server.models.User;
import com.lovebox.server.models.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
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

    @PostMapping("/user/device/{deviceCode}")
    public void registerDevice(Principal principal, @PathVariable String deviceCode){
        Optional<Device> maybeDevice = deviceRepository.findFirstByCode(deviceCode);
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

    @PutMapping("/user/device/{code}/name/{name}")
    void setDeviceName(@PathVariable String code, @PathVariable String name){
        Optional<Device> maybeDevice = deviceRepository.findFirstByCode(code);
        if(!maybeDevice.isPresent()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Device device = maybeDevice.get();
        device.setName(name);
        deviceRepository.save(device);
    }

}
