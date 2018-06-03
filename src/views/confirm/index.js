//React
import React, { Component } from 'react';
import { Container, Content } from 'native-base';
import { NavigationActions } from 'react-navigation';

// Local
import BackgroundImage from '../../general/backgroundImage/';
import Message from './components/message.component';

const Confirm = props => {
  const backAction = NavigationActions.reset({ index: 0, actions: [NavigationActions.navigate({ routeName: 'Login'})] });
  return (
    <Container>
      <BackgroundImage dimensions={props.screenProps.dimensions} />
      <Content padder>
        <Message press={() => props.navigation.dispatch(backAction)} />
      </Content>
    </Container>
  );
};

export default Confirm;