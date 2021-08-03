package com.lovebox.server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Image {
    @Id
    @GeneratedValue
    private Long id;

    @OneToOne(mappedBy = "image")
    private Status status;

    @OneToMany(mappedBy = "image", fetch = FetchType.LAZY,
            cascade = CascadeType.ALL)
    private List<ImagePart> parts;

    private String name;

    private Date date;

}
