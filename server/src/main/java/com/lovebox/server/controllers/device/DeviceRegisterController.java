package com.lovebox.server.controllers.device;

import com.lovebox.server.models.Client;
import com.lovebox.server.models.ClientRepository;
import com.lovebox.server.models.Device;
import com.lovebox.server.models.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

@RestController
public class DeviceRegisterController {
    @Autowired
    ClientRepository clientRepository;

    @Autowired
    DeviceRepository deviceRepository;

    @ResponseStatus( HttpStatus.CREATED )
    @PostMapping("/device/register/{deviceName}")
    public String registerDevice(@PathVariable String deviceName){
        Client client = new Client();
        client.setClientName(deviceName);
        client.setPassword(generatePasswordString());
        client.setType(Client.TYPE_DEVICE);

        clientRepository.save(client);

        Device device = new Device();
        device.setDevice(client);

        deviceRepository.save(device);
        return client.getPassword();
    }

    protected String generatePasswordString() {
        String SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        StringBuilder salt = new StringBuilder();
        Random rnd = new Random();
        while (salt.length() < 8) { // length of the random string.
            int index = (int) (rnd.nextFloat() * SALTCHARS.length());
            salt.append(SALTCHARS.charAt(index));
        }
        String saltStr = salt.toString();
        return saltStr;

    }
}
