package com.lovebox.server.controllers.user;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.lovebox.server.ImageService;
import com.lovebox.server.controllers.requests.StatusTextRequest;
import com.lovebox.server.controllers.responses.StatusResponse;
import com.lovebox.server.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
public class UserStatusController {
    @Autowired
    TextRepository textRepository;

    @Autowired
    StatusRepository statusRepository;

    @Autowired
    DeviceRepository deviceRepository;

    @Autowired
    ImageService imageService;

    @Autowired
    ImageRepository imageRepository;

    @GetMapping("/user/device/{deviceCode}/status")
    public List<StatusResponse> getStatuses(@PathVariable String deviceCode,
                            @RequestParam(defaultValue = "0") int page,
                            @RequestParam(defaultValue = "5") int size){
        Optional<Device> maybeDevice = deviceRepository.findFirstByCode(deviceCode);
        if(!maybeDevice.isPresent()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Device device = maybeDevice.get();

        //TODO:Check if current user is registered for device

        Pageable paging = PageRequest.of(page, size);
        List<Status> statuses = statusRepository.findByDeviceOrderByDateDesc(device, paging).getContent();
        return statuses.stream().map(StatusResponse::fromStatus).collect(Collectors.toList());
    }

    @PostMapping("/user/device/{deviceCode}/status/text")
    public StatusResponse postTextStatus(@RequestBody StatusTextRequest statusText, @PathVariable String deviceCode){
        Text dbText = new Text(statusText.getText());
        dbText.setColor(statusText.getColor());
        dbText.setSize(statusText.getSize());
        dbText.setBackgroundColor(statusText.getBackgroundColor());
        Status status = new Status();
        status.setDate(new Date());
        status.setNotifier(statusText.getNotifier());
        status.setType(Status.TYPE_TEXT);
        status.setText(textRepository.save(dbText));
        status.setSeen(false);
        status.setPreview(dbText.getText().substring(0, Math.min(dbText.getText().length(), 15)));

        Optional<Device> maybeDevice = deviceRepository.findFirstByCode(deviceCode);
        if(!maybeDevice.isPresent()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Device device = maybeDevice.get();
        status.setDevice(device);

        return StatusResponse.fromStatus(statusRepository.save(status));
    }

    @PostMapping("/user/device/{deviceCode}/status/image")
    public StatusResponse postImageStatus(@RequestParam("file") MultipartFile file, @RequestParam(defaultValue = "0") int notifier, @PathVariable String deviceCode)  throws Exception{
        if (file.isEmpty()) {
            return null;
        }
        Image dbImage = new Image();
        dbImage.setName(file.getName());
        dbImage.setDate(new Date());

        String fileName = file.getOriginalFilename();

        AWSCredentials credentials = new BasicAWSCredentials(
                "<AWS accesskey>",
                "<AWS secretkey>"
        );

        final AwsClientBuilder.EndpointConfiguration endpoint = new AwsClientBuilder.EndpointConfiguration("http://localstack:4566", "us-east-1");
        AmazonS3 s3client = AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withEndpointConfiguration(endpoint)
                .withPathStyleAccessEnabled(true)
                .build();

        //TODO: use real s3 bucket
        String bucketName = "test";
        if(s3client.doesBucketExist(bucketName)) {
            System.out.println("Bucket exist");
        }else {
            s3client.createBucket(bucketName);
        }

        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(file.getSize());

        String s3Key = UUID.randomUUID().toString();

        dbImage.setKey(s3Key);

        s3client.putObject(
                bucketName,
                dbImage.getKey(),
                file.getInputStream(),
                metadata
        );
        System.out.println(s3client.getUrl(bucketName, s3Key));

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
        Status status = new Status();
        status.setDate(new Date());
        status.setNotifier(notifier);
        status.setType(Status.TYPE_IMAGE);
        status.setImage(dbImage);
        status.setSeen(false);
        status.setPreview(s3Key);

        Optional<Device> maybeDevice = deviceRepository.findFirstByCode(deviceCode);
        if(!maybeDevice.isPresent()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        Device device = maybeDevice.get();
        status.setDevice(device);

        return StatusResponse.fromStatus(statusRepository.save(status));
    }

}
