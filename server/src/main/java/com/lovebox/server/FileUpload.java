package com.lovebox.server;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.imageio.ImageIO;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
public class FileUpload {

    @PostMapping("/")
    public String handleFileUpload(@RequestParam("file") MultipartFile file) {
        return file.getOriginalFilename();
    }

    @GetMapping("/heartbeat")
    public String heartbeat(){
        return "I work";
    }

    /*@Autowired
    StorageService storageService;

    @PostMapping("/upload") // //new annotation since 4.3
    public String singleFileUpload(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return "Please select a file to upload";
        }

        BufferedImage image = null;
        try {
            image = createImageFromBytes(file.getBytes());
        }catch (IOException e) {
            e.printStackTrace();
        }

        if(image == null){
            return "Failed";
        }




        return "Uploaded File hmm";
    }

    @GetMapping("/download/{index}")
    public void downloadImage(HttpServletResponse response,
                              HttpServletRequest request, @PathVariable int index) throws IOException{
        BufferedImage image = null;
        File f = null;

        f = new File("./dragonSmall.png");
        image = ImageIO.read(f);

        int indexX = index%8;
        int indexY = (index - (index%8)) / 8;


        byte[] data = new byte[4800];
        int currentPixel = 0;
        for(int i  = indexY * height; i < (indexY + 1) * height; i++){
            for(int j = indexX * width; j < (indexX +1) * width; j++){
                int rawPixel = image.getRGB(j, i);
                data[currentPixel] = (byte) (((rawPixel&248)>>3)+((rawPixel>>5)&224));
                currentPixel++;
                data[currentPixel] = (byte) (((rawPixel>>13)&7) + ((rawPixel>>16)&248));
                currentPixel++;

            }
        }

        response.setContentType("application/x-download");
        //response.setHeader("Content-Disposition", "attachment; filename=foo.pdf");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Cache-Control", "no-cache");
        response.getOutputStream().write(data);
    }*/

    @GetMapping("/update")
    public String handleUpdate(){
        return "{\"latest\":0,\"id\":7,\"text\":\"Hejsan\"}";
    }

    private BufferedImage createImageFromBytes(byte[] imageData) {
        ByteArrayInputStream bais = new ByteArrayInputStream(imageData);
        try {
            return ImageIO.read(bais);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
