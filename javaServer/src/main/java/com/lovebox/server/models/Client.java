package com.lovebox.server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Client {
    public static final String TYPE_DEVICE = "DEVICE";
    public static final String TYPE_USER = "USER";

    @Id
    @GeneratedValue
    private Long id;

    private String clientName;
    private String password;
    private String type;
}
