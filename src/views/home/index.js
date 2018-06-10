// React
import React, { Component } from 'react';
import { Dimensions, Platform } from 'react-native';
import { Container, Toast } from 'native-base';
import stripe from 'tipsi-stripe'

// Firebase
import firebase from '../../general/firebase/';

// Local
import BackgroundImage from '../../general/backgroundImage/';
import Content from './containers/content.container';
import Footer from './components/footer.component';

// Secrets
import { STRIPE_PUBLISHABLE_KEY, APPLE_PAY_MERCHANT_ID } from '../../config/secrets';

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			amount: 0,
			loading: true,
		};

		this.addAmount = this.addAmount.bind(this);
		this.resetAmount = this.resetAmount.bind(this);
		this.editAmount = this.editAmount.bind(this);
		this.processPayment = this.processPayment.bind(this);
		this.showError = this.showError.bind(this);
	}

	UNSAFE_componentWillMount() {
		const { uid } = firebase.auth().currentUser;
		firebase.database().ref(`users/${uid}`).once('value').then(snapshot => {
			this.setState({
			amount: snapshot.val().amount,
			loading: false,
			});
		});
		stripe.setOptions({
			publishableKey: STRIPE_PUBLISHABLE_KEY,
			merchantId: APPLE_PAY_MERCHANT_ID,
			androidPayMode: 'test',
		})
	}

	addAmount(amount) {
		this.editAmount(this.state.amount + amount)
	}

	resetAmount() {
		this.editAmount(0);
	}

	editAmount(a) {
		const amount = Math.round(a*100)/100;
		this.setState({ amount });
		const { uid } = firebase.auth().currentUser;
		firebase.database().ref(`users/${uid}`).update({ amount });
	}

	processPayment() {
		
	}

	showError(msg) {
		Toast.show({
			text: msg,
			position: "bottom",
			buttonText: "OK",
			duration: 100000,
		});
	}

	render() {
		return (
			<Container>
				<BackgroundImage
					dimensions={this.props.screenProps.dimensions}
				/>
				<Content
					amount={this.state.amount}
					addAmount={this.addAmount}
					resetAmount={this.resetAmount}
					loading={this.state.loading}
				/>
				<Footer
					processPayment={this.processPayment}
				/>
			</Container>
		);
	}
}

export default Home;