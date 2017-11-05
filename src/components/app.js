import { h, Component } from 'preact';

import Banner from './banner';
import SearchForm from './searchForm';
import ResultsMap from './resultsMap';
import Results from './results';
import SocialBox from './socialBox';
import ModalToggle from './modalToggle';
import Modal from './modal';

class App extends Component {
	constructor() {
		super();
			this.state = {
				results: [],
				show_modal: false,
				map: '',
		};
		this.setResults = this.setResults.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.displayVenues = this.displayVenues.bind(this);
	}

	componentDidMount() {
    // Initialize mapbox
    const map = L.map('map').setView([43.65323, -79.38318], 12);

    // Disable scrolling when hovering on map
    map.scrollWheelZoom.disable();

    // Some Mapbox specifics for on load [suplied by mapbox]
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      maxZoom: 18,
      id: 'rbnhmll.n1oca4ci',
      accessToken: 'pk.eyJ1IjoicmJuaG1sbCIsImEiOiI3NjY4ZDk5NjFhMTYyMDMxMWFmMmM5YWEzMzlkMDgwZiJ9.Ep7u1zX_6SFI94jPki9O-w',
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
    } else {
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
      duration: 500,
    });

    L.Icon.Default.imagePath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.3/images/';
    const self = this;
    this.state.results.forEach((result) => {
      const v = result.venue;
      const address = v.location.formattedAddress[0];
      L.marker([v.location.lat, v.location.lng]).addTo(self.state.map).bindPopup(`${v.name}:<br>${address}`);
    });
    this.state.map.setView(
      [this.state.results[0].venue.location.lat, this.state.results[0].venue.location.lng], 15,
    );
  }

	render() {
		return (
			<div id="app">
				<div className="wrapper">
					<Banner />
					<SearchForm
						results={this.state.searchResults}
						setResults={this.setResults}
						displayVenues={this.displayVenues}
					/>
					<ResultsMap
						results={this.state.results}
						map={this.state.map}
					/>
					{
						this.state.results.length
							? <Results results={this.state.results} />
							: null
					}
					<SocialBox />
					<ModalToggle toggleModal={this.toggleModal} />
					<Modal
						show_modal={this.state.show_modal}
						closeModal={this.closeModal}
					/>
				</div>
			</div>
		);
	}
}

export default App;