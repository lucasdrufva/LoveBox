import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const notifiers = {
  RAINBOW: {name: 'Rainbow', value: 0},
  FLASH: {name: 'Flash', value: 1},
};

export default function NotifierPicker({onChange}) {
  const selectedOption = useState(notifiers.RAINBOW);

  useEffect(() => {
    if (onChange) {
      onChange(selectedOption[0].value);
    }
  }, [onChange, selectedOption]);

  return (
    <View>
      <Option option={notifiers.RAINBOW} selectedOption={selectedOption} />
      <Option option={notifiers.FLASH} selectedOption={selectedOption} />
    </View>
  );
}

function Option({option, selectedOption}) {
  return (
    <View style={styles.option}>
      <TouchableOpacity onPress={() => selectedOption[1](option)}>
        <RadioButton selected={selectedOption[0].name === option.name} />
      </TouchableOpacity>
      <Text>{option.name}</Text>
    </View>
  );
}

function RadioButton(props) {
  return (
    <View style={styles.outerRadio}>
      {props.selected ? <View style={styles.innerRadio} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  outerRadio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 7,
  },
  innerRadio: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
});
