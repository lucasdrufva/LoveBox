package com.lovebox.server.models;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional(readOnly = true)
public interface ImagePartRepository extends JpaRepository<ImagePart, Long> {
    @Transactional
    List<ImagePart> findPartsByImage(Image image);
}