package com.lovebox.server.models;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;

@NoArgsConstructor
@RequiredArgsConstructor
@Getter
@Setter
@Entity
public class Text {
    @Id
    @GeneratedValue
    private Long id;

    @OneToOne(mappedBy = "text")
    private Status status;

    @NonNull
    private String text;
}
