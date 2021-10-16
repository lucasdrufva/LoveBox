package com.lovebox.server;

import com.drew.imaging.ImageMetadataReader;
import com.drew.imaging.ImageProcessingException;
import com.drew.metadata.Metadata;
import com.drew.metadata.MetadataException;
import com.drew.metadata.exif.ExifIFD0Directory;
import com.lovebox.server.models.Image;
import com.lovebox.server.models.ImagePart;
import com.lovebox.server.models.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
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

    public static BufferedImage rotateImage(BufferedImage imageToRotate, int orientation) {
        int degrees = 0;
        switch (orientation){
            case 0:
            case 1:
                return imageToRotate;
            case 3:
                degrees = 180;
                break;
            case 6:
                degrees = 90;
                break;
            case 8:
                degrees = 270;
                break;
        }
        int widthOfImage = imageToRotate.getWidth();
        int heightOfImage = imageToRotate.getHeight();
        int typeOfImage = imageToRotate.getType();

        BufferedImage newImageFromBuffer = new BufferedImage(widthOfImage, heightOfImage, typeOfImage);

        Graphics2D graphics2D = newImageFromBuffer.createGraphics();

        graphics2D.rotate(Math.toRadians(90), widthOfImage / 2, heightOfImage / 2);
        graphics2D.drawImage(imageToRotate, null, 0, 0);

        return newImageFromBuffer;
    }

    public  BufferedImage resizeImage(BufferedImage img, int width, int height, int orientation) {
        BufferedImage image = rotateImage(img, orientation);
        int type=0;
        type = image.getType() == 0? BufferedImage.TYPE_INT_ARGB : image.getType();
        BufferedImage resizedImage = new BufferedImage(width, height,type);
        Graphics2D g = resizedImage.createGraphics();
        g.drawImage(image, 0, 0, width, height, null);
        g.dispose();
        return resizedImage;
    }

    public BufferedImage createImageFromBytes(byte[] imageData) {
        ByteArrayInputStream bais = new ByteArrayInputStream(imageData);
        ByteArrayInputStream metaStream = new ByteArrayInputStream(imageData);
        try {
            Metadata metadata = ImageMetadataReader.readMetadata(metaStream);
            ExifIFD0Directory exifIFD0 = metadata.getFirstDirectoryOfType(ExifIFD0Directory.class);
            int orientation = exifIFD0.getInt(ExifIFD0Directory.TAG_ORIENTATION);
            return resizeImage(ImageIO.read(bais), 320, 240, orientation);
        } catch (IOException | ImageProcessingException | MetadataException e) {
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
