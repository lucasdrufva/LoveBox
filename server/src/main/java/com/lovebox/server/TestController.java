package com.lovebox.server;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {
    @GetMapping("/test/device")
    public String getDevice(){
        return "You are a device";
    }

    @GetMapping("/test/user")
    public String getUser(){
        return "You are a user";
    }
}
