package com.lovebox.server.controllers.device;

import com.lovebox.server.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
public class DeviceTouchController {
    @Autowired
    TouchRepository touchRepository;

    @Autowired
    DeviceRepository deviceRepository;

    @Autowired
    NotificationRepository notificationRepository;

    @PutMapping("/device/touch")
    void putStatusSeen(Principal principal, @RequestParam(defaultValue = "1") int size){
        Optional<Device> maybeDevice = deviceRepository.findFirstByCode(principal.getName());
        if(!maybeDevice.isPresent()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Device device = maybeDevice.get();

        Touch touch = new Touch();
        touch.setDate(new Date());
        touch.setSize(size);
        device.getTouches().add(touch);
        deviceRepository.save(device);

        List<User> users = device.getUsers();
        for (User user: users) {
            Notification notification = new Notification();
            notification.setDate(new Date());
            notification.setUser(user);
            notification.setMessage("" + device.getName() + " sent love of size " + size);
            notificationRepository.save(notification);
        }
    }
}
