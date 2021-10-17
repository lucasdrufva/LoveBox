package com.lovebox.server.controllers.user;

import com.lovebox.server.controllers.responses.DeviceResponse;
import com.lovebox.server.controllers.responses.NotificationResponse;
import com.lovebox.server.models.Notification;
import com.lovebox.server.models.NotificationRepository;
import com.lovebox.server.models.User;
import com.lovebox.server.models.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class UserNotificationController {
    @Autowired
    UserRepository userRepository;

    @Autowired
    NotificationRepository notificationRepository;

    @GetMapping("/user/notification")
    List<NotificationResponse> getNotifications(Principal principal, @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "5") int size){
        Optional<User> maybeUser = userRepository.findFirstByClientClientName(principal.getName());
        if(!maybeUser.isPresent()){
            //TODO: Throw unauthorized!
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        User user = maybeUser.get();
        Pageable paging = PageRequest.of(page, size);
        return notificationRepository.findByUserAndSeenFalseOrderByDateDesc(user, paging).getContent().stream().map(NotificationResponse::fromNotification).collect(Collectors.toList());
    }
}
