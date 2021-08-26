package com.lovebox.server.controllers.responses;

import com.lovebox.server.models.Status;
import lombok.*;

import java.util.Date;

@NoArgsConstructor
@Getter
@Setter
public class StatusResponse {
    @NonNull
    private Long id;
    private int type;
    private int notifier;

    private Long contentId;
    private boolean seen;
    private Date date;
    private String preview;

    public static StatusResponse fromStatus(Status status){
        StatusResponse response = new StatusResponse();
        response.setId(status.getId());
        response.setType(status.getType());
        response.setNotifier(status.getNotifier());
        response.setSeen(status.isSeen());
        response.setDate(status.getDate());
        response.setPreview(status.getPreview());
        if(status.getType() == Status.TYPE_IMAGE){
            response.setContentId(status.getImage().getId());
        }else if(status.getType() == Status.TYPE_TEXT){
            response.setContentId(status.getText().getId());
        }

        return response;
    }
}