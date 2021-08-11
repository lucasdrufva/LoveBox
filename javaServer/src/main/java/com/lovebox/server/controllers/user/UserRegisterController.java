package com.lovebox.server.controllers.user;

import com.lovebox.server.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.Optional;

@RestController
public class UserRegisterController {
    @Autowired
    UserRepository userRepository;

    @ResponseStatus( HttpStatus.CREATED )
    @PostMapping("/user/register")
    public Long registerClient(@RequestBody User user){
        return userRepository.save(user).getId();
    }

    @GetMapping("/user")
    public String getCurrentUser(Principal principal){
        Optional<User> maybeUser = userRepository.findFirstByClientClientName(principal.getName());
        if(maybeUser.isPresent()){
            return maybeUser.get().getClient().getClientName();
        }else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
    }
}
