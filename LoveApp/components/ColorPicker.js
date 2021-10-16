import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import CP from 'react-native-hsv-color-picker';

import {hslToRgb} from '../lib/colorTools';

function ColorPickerContainer(props) {
  const {children, hide, style} = props;
  if (hide) {
    return null;
  }
  return (
    <View {...this.props} style={style}>
      {children}
    </View>
  );
}

export default function ColorPicker({show, onChange, startHSL}) {
  const [pickerColor, setPickerColor] = useState(startHSL);

  useEffect(() => {
    onChange(hslToRgb(pickerColor.hue / 360, pickerColor.sat, pickerColor.val));
  }, [pickerColor, onChange]);

  return (
    <View>
      <ColorPickerContainer hide={!show}>
        <CP
          satValPickerHue={pickerColor.hue}
          satValPickerSaturation={pickerColor.sat}
          satValPickerValue={pickerColor.val}
          huePickerHue={pickerColor.hue}
          onHuePickerPress={({hue}) => {
            setPickerColor({...pickerColor, hue: hue});
          }}
          onSatValPickerPress={({saturation, value}) => {
            setPickerColor({...pickerColor, sat: saturation, val: value});
          }}
        />
      </ColorPickerContainer>
    </View>
  );
}

export function ExpandableColorPicker({onChangeColor, startHSL}) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [color, setColor] = useState([255, 255, 255]);

  function getTextColorStyle() {
    return {
      backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
    };
  }

  useEffect(() => {
    onChangeColor(color);
  }, [color, onChangeColor]);

  return (
    <>
      <TouchableOpacity
        style={{...styles.colorView, ...getTextColorStyle()}}
        onPress={() => {
          setShowColorPicker(!showColorPicker);
        }}
      />
      <ColorPicker
        show={showColorPicker}
        onChange={setColor}
        startHSL={startHSL}
      />
    </>
  );
}

const styles = StyleSheet.create({
  colorView: {
    flex: 3,
    borderRadius: 7,
    backgroundColor: '#e8fcf6',
    padding: 10,
    paddingBottom: 25,
    margin: 10,
    elevation: 10,
  },
});
