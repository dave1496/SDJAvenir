// React
import React, { Component } from 'react';
import { Dimensions, Platform } from 'react-native';
import { Container, Toast } from 'native-base';
import stripe from 'tipsi-stripe';
import axios from 'axios';

// Firebase
import firebase from '../../general/firebase/';

// Local
import BackgroundImage from '../../general/backgroundImage/';
import Content from './containers/content.container';
import Footer from './components/footer.component';

// Secrets
import { STRIPE_PUBLISHABLE_KEY, APPLE_PAY_MERCHANT_ID, BACK_URL } from '../../config/secrets';

class Home extends Component {
	constructor(props) {
		super(props);

		this.state = {
			amount: 0,
			email: "",
			loading: true,
		};

		this.addAmount = this.addAmount.bind(this);
		this.resetAmount = this.resetAmount.bind(this);
		this.editAmount = this.editAmount.bind(this);
		this.appleProcessPayment = this.appleProcessPayment.bind(this);
		this.androidProcessPayment = this.androidProcessPayment.bind(this);
		this.cardPayment = this.cardPayment.bind(this);
		this.processPayment = this.processPayment.bind(this);
		this.processCharges = this.processCharges.bind(this);
		this.saveDonation = this.saveDonation.bind(this);
		this.showError = this.showError.bind(this);
	}

	UNSAFE_componentWillMount() {
		const { uid } = firebase.auth().currentUser;
		firebase.database().ref(`users/${uid}`).on('value', snapshot => {
			const user = snapshot.val() ? snapshot.val() : {};
			this.setState({
				amount: user.amount,
				email: user.email,
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

	appleProcessPayment() {
		stripe.deviceSupportsApplePay().then(supportsApplePay => {
			if (supportsApplePay) {
				stripe.canMakeApplePayPayments({ networks: ['american_express', 'discover', 'master_card', 'visa'] }).then(canMakePayments => {
					if (canMakePayments) {
						const { amount } = this.state;
						const options = { amount, label: "SDJ Tsedaka" };
						stripe.paymentRequestWithApplePay(options)
						.then(token => this.processCharges(token))
						.catch(() => this.cardPayment());
					} else this.cardPayment();
				}).catch(() => this.cardPayment());
			} else {
				this.cardPayment();
			}
		}).catch(() => this.cardPayment());
	}

	androidProcessPayment() {
		this.cardPayment();
	}

	cardPayment() {
		const options = {
			managedAccountCurrency: "EUR",
			prefilledInformation: {
				email: this.state.email,
			},
		}
		stripe.paymentRequestWithCardForm(options)
		.then(token => this.processCharges(token))
		.catch(() => this.showError("An error has occured"));
	}

	processPayment() {
		if (this.state.amount < 5) {
			this.showError("Il faut que le montant soit supérieur à 5 euros");
		} else {
			if (Platform.OS === 'ios') this.appleProcessPayment();
			else this.androidProcessPayment();
		}
	}

	processCharges(token) {
		axios.post(`${BACK_URL}/processPayment`, {
			token: token.tokenId,
			amount: this.state.amount*100,
		})
		.then(() => this.saveDonation())
		.catch(() => this.showError("Erreur dans le paiement, veuillez réessayer"));
	}

	saveDonation() {
		firebase.database().ref("/donations").push().set({
			date: new Date().toString(),
			userId: firebase.auth().currentUser.uid,
			amount: this.state.amount,
			type: "CARTE BANCAIRE"
		})
		.then(() => alert("Le paiement a été réalisé avec succès. Vous pouvez retrouver votre reçu cerfa dans l'historique de vos dons."))
		.catch(() => this.showError("Erreur dans le paiement, veuillez réessayer"));
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