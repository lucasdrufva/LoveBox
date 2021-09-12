package com.lovebox.server.models;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImagePartRepository extends JpaRepository<ImagePart, Long> {}