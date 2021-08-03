package com.lovebox.server.controllers;

import com.lovebox.server.controllers.responses.TextResponse;
import com.lovebox.server.models.Text;
import com.lovebox.server.models.TextRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class TextController {
    @Autowired
    TextRepository textRepository;

    @PostMapping("/text/{text}")
    public Long postText(@PathVariable String text){
        Text dbText = new Text(text);
        return textRepository.save(dbText).getId();
    }

    @GetMapping("/text/{id}")
    public TextResponse getText(@PathVariable Long id){
        return new TextResponse(textRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND)).getText());
    }
}
