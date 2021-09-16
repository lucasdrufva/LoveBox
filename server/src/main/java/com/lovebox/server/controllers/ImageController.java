package com.lovebox.server.controllers;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.lovebox.server.ImageService;
import com.lovebox.server.models.Image;
import com.lovebox.server.models.ImagePartRepository;
import com.lovebox.server.models.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.util.Date;

@RestController
class ImageController {

    @Autowired
    ImageRepository imageRepository;

    @Autowired
    ImagePartRepository imagePartRepository;

    @Autowired
    ImageService imageService;

    @Transactional
    @PostMapping("/image/upload")
    Long uploadImage(@RequestParam("file") MultipartFile file) throws Exception {
        if (file.isEmpty()) {
            return null;
        }

        Image dbImage = new Image();
        dbImage.setName(file.getName());
        dbImage.setDate(new Date());

        BufferedImage image = null;
        try {
            image = imageService.createImageFromBytes(file.getBytes());
        }catch (IOException e) {
            e.printStackTrace();
        }

        if(image == null){
            return null;
        }

        dbImage.setParts(imageService.partsFromImage(image, dbImage));

        imageRepository.save(dbImage);
        return dbImage.getId();
    }

    @Transactional(readOnly=true)
    @GetMapping(value = "/image/{imageId}/part/{partIndex}")
    ByteArrayResource downloadImage(@PathVariable Long imageId, @PathVariable int partIndex) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        byte[] part = imagePartRepository.findPartsByImage(image).get(partIndex).getContent();

        return new ByteArrayResource(part);
    }

    //TODO: Change path to "/image/latest/{partIndex}"
    @GetMapping("/download/{partIndex}")
    ByteArrayResource downloadLatestImage(@PathVariable int partIndex) {
        Image image = imageRepository.findFirstByOrderByDateDesc()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        byte[] part = image.getParts().get(partIndex).getContent();

        return new ByteArrayResource(part);
    }
}
