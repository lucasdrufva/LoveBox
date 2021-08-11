package com.lovebox.server.controllers;

import com.lovebox.server.models.Client;
import com.lovebox.server.models.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.Optional;
import java.util.Random;

@RestController
public class ClientController {
    @Autowired
    ClientRepository clientRepository;

    @PostMapping("/client/register")
    public Long registerClient(@RequestBody Client client){
        return clientRepository.save(client).getId();
    }

    @PostMapping("/client/register/{clientName}")
    public String registerClient(@PathVariable String clientName){
        Client client = new Client();
        client.setClientName(clientName);
        client.setPassword(getSaltString());
        client.setType(Client.TYPE_DEVICE);

        return clientRepository.save(client).getPassword();
    }

    @GetMapping("/client/{clientName}")
    public String getClient(@PathVariable String clientName){
        Client client = clientRepository.findFirstByClientName(clientName).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return client.getClientName();
    }

    @GetMapping("/client")
    public String getCurrentClient(Principal principal){
        return principal.getName();
    }


    protected String getSaltString() {
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
