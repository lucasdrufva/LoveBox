package com.lovebox.server.models;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StatusRepository extends JpaRepository<Status, Long> {
    Optional<Status> findFirstByOrderByDateDesc();

    Optional<Status> findFirstByDeviceAndSeenFalseOrderByDateAsc(Device device);

    Page<Status> findByDeviceOrderByDateDesc(Device device, Pageable pageable);
}
