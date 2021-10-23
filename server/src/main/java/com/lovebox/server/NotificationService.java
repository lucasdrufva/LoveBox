package com.lovebox.server;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.messaging.*;
import com.lovebox.server.models.NotificationRepository;
import com.lovebox.server.models.Touch;
import com.lovebox.server.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    NotificationRepository notificationRepository;

    @PostConstruct
    public void init() throws IOException {
        System.out.println("Working Directory = " + System.getProperty("user.dir"));

        FirebaseOptions options = FirebaseOptions.builder()
                .setCredentials(GoogleCredentials.getApplicationDefault())
                .build();

        FirebaseApp.initializeApp(options);
    }

    public void sendTouchNotification(Touch touch) {
        String messageBody = "" + touch.getDevice().getName() + " sent love of size " + touch.getSize();
        System.out.println(messageBody);

        List<String> registrationTokens = new ArrayList<String>();

        List<User> users = touch.getDevice().getUsers();
        for (User user: users) {
            com.lovebox.server.models.Notification notification = new com.lovebox.server.models.Notification();
            notification.setDate(new Date());
            notification.setUser(user);
            notification.setMessage(messageBody);
            notificationRepository.save(notification);

            System.out.println("User token: " + user.getFirebaseDeviceToken());
            if(user.getFirebaseDeviceToken() != null && !(user.getFirebaseDeviceToken().isEmpty())){
                registrationTokens.add(user.getFirebaseDeviceToken());
                System.out.println("Token added to list: " + user.getFirebaseDeviceToken());
            }
        }

        if(registrationTokens.size() > 0){
            try{
                // See documentation on defining a message payload.
                MulticastMessage message = MulticastMessage.builder()
                        .setNotification(Notification.builder()
                                .setTitle(touch.getDevice().getName())
                                .setBody(messageBody)
                                .build())
                        .addAllTokens(registrationTokens)
                        .build();

                // Send a message to the device corresponding to the provided
                // registration token.
                BatchResponse response = FirebaseMessaging.getInstance().sendMulticast(message);
                // See the BatchResponse reference documentation
                // for the contents of response.
                System.out.println(response.getSuccessCount() + " messages were sent successfully");
            } catch (FirebaseMessagingException e) {
                System.out.println("failed to send push notification");
            }
        }
    }
}
