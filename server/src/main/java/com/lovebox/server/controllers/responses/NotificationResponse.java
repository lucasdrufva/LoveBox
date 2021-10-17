package com.lovebox.server.controllers.responses;

import com.lovebox.server.models.Device;
import com.lovebox.server.models.Notification;
import com.lovebox.server.models.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.Date;

@AllArgsConstructor
@Getter
public class NotificationResponse {
    private Long id;

    private Date date;

    private boolean seen;

    private String message;

    public static NotificationResponse fromNotification(Notification notification){
        return new NotificationResponse(notification.getId(), notification.getDate(), notification.isSeen(), notification.getMessage());
    }
}
