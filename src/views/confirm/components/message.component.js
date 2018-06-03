// React
import React from 'react';
import { Item, Icon, Button, Text } from 'native-base';

const Message = props => (
	<Button
    block
    light
    iconLeft
    style={Style.button}
    onPress={props.press}
  >
    <Icon name='arrow-round-back' />
    <Text>Revenir a la connexion</Text>
  </Button>
);

export default Message;