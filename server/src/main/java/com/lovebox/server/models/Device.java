package com.lovebox.server.models;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
public class Device {
    @Id
    private String code;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "client_id", referencedColumnName = "id")
    private Client device;

    @ManyToMany
    @JoinTable(
            name = "device_users",
            joinColumns = @JoinColumn(name = "device_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    private List<User> users;

    @OneToMany(mappedBy="device")
    private List<Status> statuses;

    @OneToMany(mappedBy="device")
    private List<Touch> touches;

    private String name;
}
