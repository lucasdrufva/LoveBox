package com.lovebox.server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Touch {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name="device_id", nullable=false)
    private Device device;

    private Date date;
    private int size;
}
