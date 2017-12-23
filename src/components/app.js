import { h, Component } from 'preact';

// import 'mapbox.js';
import Axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import mapboxgl from 'mapbox-gl';

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
		}
		else {
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
		}
		catch (err) {
			console.error(err)
		}
	}
	
	setMap(locData) {
		// Initialize mapbox
		mapboxgl.accessToken = this.state.mapBoxKey;
		let options = {
			container: 'map',
			zoom: 12,
			trackResize: true,
			scrollZoom: false,
			style: 'mapbox://styles/mapbox/light-v9'
		};
		// Check if the ip
		if (locData !== 'error') {
			const cityCenter = locData.data.features[0].center;
			const yourLatLng = new mapboxgl.LngLat(cityCenter[0], cityCenter[1]);
			options.center = yourLatLng;
		}
		else {
			const torontoLatLng = new mapboxgl.LngLat(-79.38318, 43.65323);
			options.center = torontoLatLng;
		}

		const nav = new mapboxgl.NavigationControl();

		const map = new mapboxgl.Map(options)
			.addControl(nav, 'top-left')
			.addControl(new mapboxgl.ScaleControl({
				maxWidth: 80,
				unit: 'metric'
			}));
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
		let markerBounds = [];

		this.state.results.forEach(result => {
			const v = result.venue;
			const lngLat = [v.location.lng, v.location.lat];
			const address = v.location.formattedAddress[0];
			// Set popup
			const markerHeight = 25, markerRadius = 15, linearOffset = 25;
			const popupOffsets = {
				top: [0, 0],
				'top-left': [0,0],
				'top-right': [0,0],
				bottom: [0, -markerHeight],
				'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
				'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
				left: [markerRadius, (markerHeight - markerRadius) * -1],
				right: [-markerRadius, (markerHeight - markerRadius) * -1]
			};
			const popup = new mapboxgl.Popup({
				offset: popupOffsets
			})
				.setHTML(`<p style="margin: 0;text-align: center; padding: 5px;">${v.name}:<br>${address}</p>`);
			// Set marker
			const marker = new mapboxgl.Marker()
				.setLngLat(lngLat)
				.setPopup(popup)
				.addTo(this.state.map);
			markerBounds.push(lngLat);
		});
		// Zoom map to area containing markers.
		const map = this.state.map;
		const bounds = markerBounds.reduce((bounds, coord) => bounds.extend(coord), new mapboxgl.LngLatBounds(markerBounds[0], markerBounds[0]));
		
		map.fitBounds(bounds, {
			padding: 75
		});
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
