package com.lovebox.server.controllers.user;

import com.lovebox.server.controllers.requests.NotificationTokenRequest;
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
    public String registerClient(@RequestBody User user){
        return userRepository.save(user).getClient().getClientName();
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

    @PutMapping("/user/notification_token")
    public void updateNotificationToken(Principal principal, @RequestBody NotificationTokenRequest req){
        Optional<User> maybeUser = userRepository.findFirstByClientClientName(principal.getName());
        if(maybeUser.isPresent()){
            User user = maybeUser.get();
            user.setFirebaseDeviceToken(req.getToken());
            userRepository.save(user);
        }
    }
}
