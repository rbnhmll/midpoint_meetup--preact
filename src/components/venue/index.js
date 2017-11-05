import { h, Component } from 'preact';

class Venue extends Component {
	render(props) {
		return (
			<div class="venueContainer" key={props.result.venue.id}>
				<img
					class="venue__image"
					src={`${props.result.venue.featuredPhotos.items[0].prefix}300x300${props.result.venue.photos.groups[0]
						.items[0].suffix}`}
					alt={props.result.venue.name}
				/>
				<h2 class="venue__name">{props.result.venue.name}</h2>
				<p class="venue__addr">{props.result.venue.location.formattedAddress[0]}</p>
				<p class="venue__city">{props.result.venue.location.formattedAddress[1]}</p>
				<p class="venue__dist">
					<span>{props.result.venue.location.distance} m</span> from midpoint.
				</p>
				<a class="venue__link" href={`https://foursquare.com/v/${props.result.venue.id}`} target="_blank">
					<i class="fa fa-foursquare" /> Visit On Foursquare
				</a>
			</div>
		);
	}
}

export default Venue;
