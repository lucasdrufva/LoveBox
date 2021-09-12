package com.lovebox.server.controllers;

import com.lovebox.server.controllers.requests.StatusRequest;
import com.lovebox.server.controllers.responses.StatusResponse;
import com.lovebox.server.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Date;

@RestController
public class StatusController {
    @Autowired
    StatusRepository statusRepository;

    @Autowired
    ImageRepository imageRepository;

    @Autowired
    TextRepository textRepository;

    @PostMapping("/status")
    StatusResponse postStatus(@RequestBody StatusRequest statusRequest){
        Status status = new Status();
        status.setDate(new Date());
        status.setNotifier(statusRequest.getNotifier());
        status.setType(statusRequest.getType());


        System.out.println("The type");
        System.out.println(statusRequest.getType());

        //TODO: Check if contentId is already used by other status
        if(statusRequest.getType() == Status.TYPE_IMAGE){
            status.setImage(imageRepository.findById(statusRequest.getContentId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
        }else if(statusRequest.getType() == Status.TYPE_TEXT){
            status.setText(textRepository.findById(statusRequest.getContentId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
        }

        statusRepository.save(status);

        return StatusResponse.fromStatus(status);
    }

    @GetMapping("/status")
    StatusResponse getStatus(){
        return StatusResponse.fromStatus(statusRepository.findFirstByOrderByDateDesc().orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)));
    }

}
