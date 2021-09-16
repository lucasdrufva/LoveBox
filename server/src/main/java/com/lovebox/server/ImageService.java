package com.lovebox.server;

import com.lovebox.server.models.Image;
import com.lovebox.server.models.ImagePart;
import com.lovebox.server.models.ImageRepository;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ImageService {
    static final int PART_WIDTH = 40;
    static final int PART_HEIGHT = 60;

    @Autowired
    ImageRepository imageRepository;

    public BufferedImage createImageFromBytes(byte[] imageData) {
        ByteArrayInputStream bais = new ByteArrayInputStream(imageData);
        try {
            return Thumbnails.of(ImageIO.read(bais)).size(481, 481).asBufferedImage();
        } catch (IOException e) {
           throw new RuntimeException(e);
        }
    }

    public List<ImagePart> partsFromImage(BufferedImage image, Image dbImage){
        List<ImagePart> parts = new ArrayList<>();

        for(int y = 0; y < 4; y++){
            for(int x = 0; x < 8; x++){
                byte[] data = new byte[4800];
                int currentPixel = 0;
                for(int i = y * PART_HEIGHT; i < (y + 1) * PART_HEIGHT; i++){
                    for(int j = x * PART_WIDTH; j < (x +1) * PART_WIDTH; j++){
                        int rawPixel = image.getRGB(j, i);
                        data[currentPixel] = (byte) (((rawPixel&248)>>3)+((rawPixel>>5)&224));
                        currentPixel++;
                        data[currentPixel] = (byte) (((rawPixel>>13)&7) + ((rawPixel>>16)&248));
                        currentPixel++;
                    }
                }
                parts.add(new ImagePart(data, dbImage));
            }
        }
        return parts;
    }
}
