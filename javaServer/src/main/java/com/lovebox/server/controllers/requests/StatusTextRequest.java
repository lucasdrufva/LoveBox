package com.lovebox.server.controllers.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class StatusTextRequest {
    private int notifier;
    private String text;
}
