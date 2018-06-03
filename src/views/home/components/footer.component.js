// React
import React from 'react';
import { Linking, Platform } from 'react-native';
import { Footer as NBFooter, FooterTab, Button, Text, Icon, Grid, Col } from 'native-base';

// Local
import Style from '../styles/footer.style';

const Footer = props => (
  <NBFooter>
    <FooterTab>
      <Grid>
        {
          Platform.OS !== 'ios' ? <Text /> :
          <Col>
            <Button
              full light
              iconLeft
              style={Style.button}
              onPress={props.applePay}
            >
              <Icon style={Style.text} ios='logo-apple' android='logo-android' />
              <Text style={Style.text}>Pay</Text>
            </Button>
          </Col>
        }
        <Col>
          <Button
            full primary
            iconLeft
            style={Style.button}
            onPress={props.paypalPayment}
          >
            <Icon style={Style.paypalText} ios='ios-card' android='md-card' />
            <Text style={Style.paypalText}>Paypal</Text>
          </Button>
        </Col>
      </Grid>
    </FooterTab>    
  </NBFooter>
);

export default Footer;