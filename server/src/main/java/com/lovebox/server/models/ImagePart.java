package com.lovebox.server.models;

import com.lovebox.server.models.Image;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@RequiredArgsConstructor
public class ImagePart {

    @Id
    @GeneratedValue
    private Long id;

    @Lob
    @NonNull
    private byte[] content;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "image_id", nullable = false)
    @NonNull
    private Image image;
}
