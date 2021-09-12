package com.lovebox.server.controllers.responses;

import com.lovebox.server.models.Text;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TextResponse {
    private String text;
    private int color;
    private int backgroundColor;
    private int size;

    public static TextResponse fromText(Text text){
        TextResponse res = new TextResponse();
        res.setText(text.getText());
        res.setColor(text.getColor());
        res.setSize(text.getSize());
        res.setBackgroundColor(text.getBackgroundColor());
        return res;
    }
}
