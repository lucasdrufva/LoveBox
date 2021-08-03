package com.lovebox.server.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class StatusRequest {
    private int type;
    private int notifier;

    private Long contentId;
}
