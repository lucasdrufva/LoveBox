package com.lovebox.server.controllers.responses;

import com.lovebox.server.models.Status;
import lombok.*;

@NoArgsConstructor
@Getter
@Setter
public class StatusResponse {
    @NonNull
    private Long id;
    private int type;
    private int notifier;

    private Long contentId;

    public static StatusResponse fromStatus(Status status){
        StatusResponse response = new StatusResponse();
        response.setId(status.getId());
        response.setType(status.getType());
        response.setNotifier(status.getNotifier());
        if(status.getType() == Status.TYPE_IMAGE){
            response.setContentId(status.getImage().getId());
        }else if(status.getType() == Status.TYPE_TEXT){
            response.setContentId(status.getText().getId());
        }

        return response;
    }
}