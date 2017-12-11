import { h, Component } from 'preact';
import Axios from 'axios';
import Turf from 'turf';

import style from './style.sass';

class SearchForm extends Component {
	constructor() {
		super();
		this.state = {
			userInput: {
				yourLocation: '',
				friendLocation: '',
				venueType: ''
			},
			centerPtResult: '',
			loadingGeo: false,
			clientId: 'RUPFMKH0N5PWTIS43LH20C1AWZCMSRJOF02L1Q0PBXEVXIR0',
			clientSecret: 'YRFJZOCG0J3RAJCLGTTAPORHLNBHRNO0X0DSBTBRNA21HMFS',
			mapBoxKey: 'pk.eyJ1IjoicmJuaG1sbCIsImEiOiI3NjY4ZDk5NjFhMTYyMDMxMWFmMmM5YWEzMzlkMDgwZiJ9.Ep7u1zX_6SFI94jPki9O-w'
		};
		this.getUserInputs = this.getUserInputs.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.convertToGeo = this.convertToGeo.bind(this);
		this.getGeocode = this.getGeocode.bind(this);
		this.getMidpoint = this.getMidpoint.bind(this);
		this.getVenues = this.getVenues.bind(this);
		this.getGeolocation = this.getGeolocation.bind(this);
		this.getReverseGeocode = this.getReverseGeocode.bind(this);
		this.addGeolocationButton = this.addGeolocationButton.bind(this);
	}

	addGeolocationButton() {
		if ('geolocation' in navigator) {
		} else {
			console.log('no geo');
		}

	}

	async getGeolocation() {
		this.setState({ loadingGeo: true });
		const position = await new Promise((resolve, reject) => {
			navigator.geolocation.getCurrentPosition((position) => {
				resolve([position.coords.longitude, position.coords.latitude]);
			});
		});
		
		const response = await this.getReverseGeocode(position);
		const addr = response.data.features[0].place_name;
		const newState = Object.assign({}, this.state);
		newState.userInput.yourLocation = addr;
		this.setState({ userInput: newState.userInput });
		this.setState({ loadingGeo: false });			
	}

	
	getUserInputs(e) {
		e.preventDefault();
		e.stopPropagation();
		if (this.state.userInput.yourLocation === '' && this.state.userInput.friendLocation === '') {
			alert('Please fill in the two location fields!');
		}
		else if (this.state.userInput.yourLocation === '') {
			alert('Please fill in your location!');
		}
		else if (this.state.userInput.friendLocation === '') {
			alert("Please fill in your friend's location!");
		}
		else if (this.state.userInput.venueType === '') {
			alert('Please choose either Coffee or Beer!');
		}
		else {
			this.convertToGeo();
		}
	}
	
	getGeocode(userEntry1, userEntry2) {
		const self = this;
		
		function firstLocation() {
			return Axios.get(
				`https://api.mapbox.com/v4/geocode/mapbox.places/${userEntry1}.json?access_token=${self.state.mapBoxKey}`
			)
			.then(response => response)
			.catch(error => {
				console.error(error);
				return error;
			});
		}

		function secondLocation() {
			return Axios.get(
				`https://api.mapbox.com/v4/geocode/mapbox.places/${userEntry2}.json?access_token=${self.state.mapBoxKey}`
			)
				.then(response => response)
				.catch(error => {
					console.error(error);
					return error;
				});
		}

		Axios.all([firstLocation(), secondLocation()]).then(
			Axios.spread((res1, res2) => {
				const coords1 = res1.data.features[0].geometry.coordinates;
				const coords2 = res2.data.features[0].geometry.coordinates;
				// reverse the array order.
				coords1.reverse();
				coords2.reverse();
				self.getMidpoint(coords1, coords2);
			})
		);
	}

	async getReverseGeocode(coordsArr) {
		const reverse = await Axios.get(
			`https://api.mapbox.com/v4/geocode/mapbox.places/${coordsArr[0]},${coordsArr[1]}.json?access_token=${this.state.mapBoxKey}` 
		);
		return reverse;
	}

	getMidpoint(coords1, coords2) {
		const features = {
			type: 'FeatureCollection',
			features: [
				{
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'Point',
						coordinates: coords1
					}
				},
				{
					type: 'Feature',
					properties: {},
					geometry: {
						type: 'Point',
						coordinates: coords2
					}
				}
			]
		};
		const centerPt = Turf.center(features);
		let centerPtResult = centerPt.geometry.coordinates;

		centerPtResult = `${centerPtResult[0]},${centerPtResult[1]}`;
		this.setState({ centerPtResult });
		this.getVenues();
	}

	getVenues() {
		const self = this;
		let sectionSelect;
		let querySelect;

		if (this.state.userInput.venueType === 'coffee') {
			sectionSelect = 'coffee';
			querySelect = 'coffee';
		}
		else if (this.state.userInput.venueType === 'beer') {
			sectionSelect = 'drinks';
			querySelect = 'beer';
		}

		// Foursquare API call
		Axios.get('https://api.foursquare.com/v2/venues/explore', {
			params: {
				ll: this.state.centerPtResult,
				client_id: this.state.clientId,
				client_secret: this.state.clientSecret,
				v: 20150722,
				radius: 3000,
				section: sectionSelect,
				openNow: 1,
				venuePhotos: 1,
				query: querySelect,
				limit: 6,
				sortByDistance: 1,
				format: 'json'
			}
		})
			.then(res3 => {
				const venueResult = res3.data.response.groups[0].items;
				self.showResults = true;
				self.props.setResults(venueResult);
				// self.props.displayVenues();
			})
			.catch(error => {
				console.error(error);
			});
	}

	handleChange(e) {
		const newState = Object.assign({}, this.state);
		newState.userInput[e.target.name] = e.target.value;
		this.setState({ userInput: newState.userInput });
	}

	convertToGeo() {
		const userEntry1 = this.state.userInput.yourLocation.split(' ');
		const userEntry2 = this.state.userInput.friendLocation.split(' ');
		this.getGeocode(userEntry1, userEntry2);
	}

	render() {
		return (
			<form class={style.submitForm} onSubmit={this.getUserInputs}>
				<div class={style.inputContainer}>
					<div class={`${style.input} input1`}>
						<label htmlFor="yourLocation" class={style.locationLabel}>
							Your Location
						</label>
						<div className={style.inputWrapper}>
							<input
								class={`${style.yourLocation} ${style.userInputField}`}
								onChange={this.handleChange}
								value={this.state.userInput.yourLocation}
								type="text"
								name="yourLocation"
								placeholder="Your address (e.g. 100 Queen Street West, Toronto)"
							/>
							<button type="button" class={style.locationArrow} title="get user location" onclick={this.getGeolocation}>
								<i
									class={
										this.state.loadingGeo ? 'fa fa-spinner fa-pulse' : 'fa fa-location-arrow'
									}
									aria-hidden="true"
								/>
							</button>
						</div>
					</div>
					<div class={`${style.input} input2`}>
						<label htmlFor="friendLocation" class={style.locationLabel}>
							Friend's location
						</label>
						<input
							class={`${style.friendLocation} ${style.userInputField}`}
							onChange={this.handleChange}
							value={this.state.userInput.friendLocation}
							type="text"
							name="friendLocation"
							placeholder="Friend's address (e.g. 1 Yonge Street, Toronto)"
						/>
					</div>
				</div>
				<div class={`${style['button-container']} animated fadeIn`}>
					<div class={style.chooserContainer}>
						<input
							checked={this.state.userInput.venueType === 'coffee'}
							onChange={this.handleChange}
							id="coffeeRadio"
							type="radio"
							name="venueType"
							value="coffee"
						/>
						<label htmlFor="coffeeRadio">Coffee</label>
						<input
							checked={this.state.userInput.venueType === 'beer'}
							onChange={this.handleChange}
							id="beerRadio"
							type="radio"
							name="venueType"
							value="beer"
						/>
						<label htmlFor="beerRadio">Beer</label>
					</div>
					<input type="submit" value="Meet up!" name="meetUp" class={style.submitBtn} />
				</div>
			</form>
		);
	}
}

export default SearchForm;
