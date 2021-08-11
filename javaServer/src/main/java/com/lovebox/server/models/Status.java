package com.lovebox.server.models;

import com.lovebox.server.controllers.requests.StatusRequest;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Status {
    public static final int TYPE_IMAGE = 0;
    public static final int TYPE_TEXT = 1;
    public static final int NOTIFIER_RAINBOW = 0;

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name="device_id", nullable=false)
    private Device device;

    private int type;
    private int notifier;

    @OneToOne
    @JoinColumn(name = "image_id", referencedColumnName = "id")
    private Image image;

    @OneToOne
    @JoinColumn(name = "text_id", referencedColumnName = "id")
    private Text text;

    private Date date;
}
