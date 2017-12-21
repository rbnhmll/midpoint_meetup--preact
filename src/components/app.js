import { h, Component } from 'preact';

import scrollToElement from 'scroll-to-element';
import 'mapbox.js';
import Axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';

import Banner from './banner';
import SearchForm from './searchForm';
import ResultsMap from './resultsMap';
import Results from './results';
// import SocialBox from './socialBox';
import Modal from './modal';
import ModalToggle from './modalToggle';

class App extends Component {
	constructor() {
		super();
		this.state = {
			results: [],
			show_modal: false,
			map: '',
			mapBoxKey: 'pk.eyJ1IjoicmJuaG1sbCIsImEiOiI3NjY4ZDk5NjFhMTYyMDMxMWFmMmM5YWEzMzlkMDgwZiJ9.Ep7u1zX_6SFI94jPki9O-w'
		};
		this.setResults = this.setResults.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.displayVenues = this.displayVenues.bind(this);
		this.defineIPLocation = this.defineIPLocation.bind(this);
		this.setMap = this.setMap.bind(this);
	}

	async componentDidMount() {
		const result = await this.defineIPLocation();
		if (result !== 'error') {
			const cityLatLng = await this.getCityLatLng(result.data.city);
			this.setMap(cityLatLng);
		} else {
			this.setMap(result);			
		}
	}

	async defineIPLocation() {
		try {
			const data = await Axios.get(`https://freegeoip.net/json/`);
			return data;
		} catch(err) {
			console.error(err, "Failed to load IP, likely due to VPN usage. This is blocked by https://freegeoip.net/")
			return "error";
		}
	}

	async getCityLatLng(city) {
		try {
			const cityLatLng = await Axios.get(
				`https://api.mapbox.com/v4/geocode/mapbox.places/${city}.json?access_token=${this.state.mapBoxKey}`);
			return cityLatLng;
		} catch(err) {
			console.error(err)
		}
	}
	
	setMap(locData) {
		// Initialize mapbox
		let map;
		// Check if the ip
		if (locData != "error") {
			const cityCenter = locData.data.features[0].center;
			map = L.map('map').setView([cityCenter[1], cityCenter[0]], 12);			
		} else {
			map = L.map('map').setView([43.65323, -79.38318], 12);
		}
	
		// Disable scrolling when hovering on map
		map.scrollWheelZoom.disable();
	
		// Some Mapbox specifics for on load [suplied by mapbox]
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			maxZoom: 18,
			id: 'rbnhmll.n1oca4ci',
			accessToken: 'pk.eyJ1IjoicmJuaG1sbCIsImEiOiI3NjY4ZDk5NjFhMTYyMDMxMWFmMmM5YWEzMzlkMDgwZiJ9.Ep7u1zX_6SFI94jPki9O-w'
		}).addTo(map);
	
		this.setState({ map });
	}

	setResults(venueResult) {
		this.setState({ results: venueResult });
		this.displayVenues();
	}

	toggleModal() {
		if (!this.state.show_modal) {
			this.setState({ show_modal: true });
		}
		else {
			this.setState({ show_modal: false });
		}
	}

	// Hide modal on click
	closeModal() {
		this.setState({ show_modal: false });
	}

	displayVenues() {
		scrollToElement('#map', {
			offset: -15,
			ease: 'linear',
			duration: 500
		});

		L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/images/';
		this.state.results.forEach(result => {
			const v = result.venue;
			const address = v.location.formattedAddress[0];
			L.marker([v.location.lat, v.location.lng])
				.addTo(this.state.map)
				.bindPopup(`${v.name}:<br>${address}`);
		});
		this.state.map.setView([this.state.results[0].venue.location.lat, this.state.results[0].venue.location.lng], 15);
	}

	render() {
		return (
			<div>
				<div class="wrapper">
					<Banner />
					<SearchForm
						results={this.state.searchResults}
						setResults={this.setResults}
						displayVenues={this.displayVenues}
					/>
					<ResultsMap results={this.state.results} map={this.state.map} />
					{this.state.results.length ? <Results results={this.state.results} /> : null}
					{/* <SocialBox /> */}
					<ModalToggle toggleModal={this.toggleModal} />
					<Modal show_modal={this.state.show_modal} closeModal={this.closeModal} />
				</div>
			</div>
		);
	}
}

export default App;
