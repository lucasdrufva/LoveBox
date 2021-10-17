package com.lovebox.server.models;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Notification {
        @Id
        @GeneratedValue
        private Long id;

        @ManyToOne
        @JoinColumn(name="user_id", nullable=false)
        private User user;

        private Date date;

        private boolean seen = false;

        private String message;

}
